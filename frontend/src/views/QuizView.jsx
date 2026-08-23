import React, { useState, useEffect } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, RotateCcw, ChevronLeft, ChevronRight, Trophy, User, ArrowRight, UserCheck, BarChart3, Award, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import ParticipantSelector from '../components/ParticipantSelector';

export default function QuizView() {
  const [activeTab, setActiveTab] = useState('play'); // 'play' or 'results'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [summary, setSummary] = useState({ alizeeGlobalPercent: 50, lucasGlobalPercent: 50, totalVotes: 0, uniqueVotersCount: 0, byCategory: [] });
  const [selectedPlayer, setSelectedPlayer] = useState(localStorage.getItem('quiz_voter_alizee') || '');
  const [myVotes, setMyVotes] = useState({});
  const [hasStarted, setHasStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const [participants, setParticipants] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Famille');
  const [newAvatar, setNewAvatar] = useState('🦕');

  const fetchParticipants = () => {
    fetch('/api/participants')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setParticipants(data.participants || []);
        }
      });
  };

  const fetchQuizData = () => {
    setLoading(true);
    fetch('/api/quiz/results')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQuestions(data.questions || []);
          setSummary(data.summary || { alizeeGlobalPercent: 50, lucasGlobalPercent: 50, totalVotes: 0, uniqueVotersCount: 0, byCategory: [] });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading quiz", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuizData();
    fetchParticipants();
    if (selectedPlayer) {
      const saved = JSON.parse(localStorage.getItem(`quiz_votes_alizee_${selectedPlayer}`) || '{}');
      setMyVotes(saved);
    }
  }, []);

  const handleSelectPlayer = (name) => {
    setSelectedPlayer(name);
    localStorage.setItem('quiz_voter_alizee', name);
    const saved = JSON.parse(localStorage.getItem(`quiz_votes_alizee_${name}`) || '{}');
    setMyVotes(saved);
  };

  const handleCreatePlayer = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          role: newRole,
          avatar: newAvatar
        })
      });
      const data = await res.json();
      if (data.success) {
        setParticipants(data.participants || []);
        handleSelectPlayer(newName.trim());
        setShowAddModal(false);
        setNewName('');
        confetti({ particleCount: 30, spread: 50 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [isVoting, setIsVoting] = useState(false);

  const handleStart = () => {
    if (!selectedPlayer) {
      if (participants.length > 0) {
        handleSelectPlayer(participants[0].name);
      } else {
        handleSelectPlayer('Maman');
      }
    }
    setHasStarted(true);
    setIsFinished(false);
    setActiveTab('play');
  };

  const handleVote = async (questionId, choice) => {
    if (isVoting) return;
    setIsVoting(true);

    const voter = selectedPlayer || 'Un proche';
    
    // Save locally immediately
    setMyVotes(prev => {
      const updated = { ...prev, [questionId]: choice };
      localStorage.setItem(`quiz_votes_alizee_${voter}`, JSON.stringify(updated));
      return updated;
    });

    try {
      const res = await fetch('/api/quiz/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, voter, choice })
      });
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions || []);
        setSummary(data.summary || summary);
      }
    } catch (err) {
      console.error("Error submitting vote", err);
    }

    // Auto-advance after showing selected state clearly
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // FIN DU QUIZZ -> Confettis et bascule vers les résultats par catégorie
        setIsFinished(true);
        setActiveTab('results');
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#facc15', '#4ade80', '#eab308', '#22c55e', '#38bdf8']
        });
      }
      setIsVoting(false);
    }, 380);
  };

  const currentQ = questions[currentIndex];
  const progressPct = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  return (
    <div className="space-y-4 pb-8">
      {/* Header Banner */}
      <div className="glass-card-sun rounded-3xl p-5 border border-sun-300 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sun-800 bg-white/80 px-2.5 py-0.5 rounded-full border border-sun-200 flex items-center gap-1 w-fit">
                <Sparkles className="w-3 h-3 text-sun-600" />
                <span>Duel des Parents • 50 Questions</span>
              </span>
              
              <span className="text-[10px] font-bold text-slate-600 bg-white/90 px-2.5 py-0.5 rounded-full border border-sun-200 flex items-center gap-1 shadow-2xs">
                👥 {summary.uniqueVotersCount || 0} {(summary.uniqueVotersCount || 0) > 1 ? 'personnes ont répondu' : 'personne a répondu'}
              </span>
            </div>

            <h2 className="font-serif text-xl font-extrabold text-slate-800">
              💙 Qui d'Alizée ou Lucas... ? 🦕
            </h2>
            <p className="text-xs text-amber-800 font-medium">
              Votez et découvrez qui remportera les 5 grands titres de parents !
            </p>
          </div>
          <span className="text-3xl">⚖️</span>
        </div>

        {/* Clean Segmented Control: Quizz vs Résultats */}
        <div className="grid grid-cols-2 p-1 bg-white/80 rounded-2xl border border-sun-200 mt-3.5 shadow-2xs text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab('play'); }}
            className={`py-2 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'play'
                ? 'bg-amber-500 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quizz
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('results'); fetchQuizData(); }}
            className={`py-2 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'results'
                ? 'bg-mint-600 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Résultats
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. ONGLET JOUER AU QUIZZ (ACCUEIL OU QUESTIONS)         */}
      {/* ======================================================== */}
      {activeTab === 'play' && (
        <>
          {!hasStarted ? (
            /* ÉCRAN 0 : SÉLECTION DU JOUEUR & DÉMARRAGE */
            <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-[#EFE89F] text-center space-y-4 animate-in zoom-in-95">
              <span className="text-4xl">👑</span>

              <div className="space-y-1">
                <h3 className="font-serif text-lg font-black text-[#1E4E42]">
                  Qui d'Alizée ou Lucas... ?
                </h3>
                <p className="text-xs text-sun-800 font-medium">
                  50 questions réparties en 5 grandes catégories familiales !
                </p>
              </div>

              {/* Clean Player Selection with photo, role and creation modal */}
              <div className="text-left pt-1">
                <ParticipantSelector
                  selectedName={selectedPlayer}
                  onSelect={(name) => handleSelectPlayer(name)}
                  label="Sélectionner un joueur :"
                />
              </div>

              <button
                type="button"
                onClick={handleStart}
                className="w-full bg-gradient-to-r from-[#D26E7B] to-[#be5361] text-white font-bold py-3.5 rounded-2xl shadow-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Commencer le Quizz 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* ÉCRAN 1 : QUESTION EN COURS */
            loading ? (
              <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-[#EFE89F] shadow-sm">
                <div className="w-8 h-8 border-3 border-[#D26E7B] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-bold text-slate-600">Chargement des 50 questions du duel...</p>
              </div>
            ) : currentQ ? (
              <div key={`question-card-${currentQ.id || currentIndex}`} className="bg-white rounded-3xl p-5 shadow-lg border-2 border-[#EFE89F] space-y-4 relative overflow-hidden animate-in fade-in zoom-in-95">
                {/* Top Bar */}
                <div className="flex items-center justify-between border-b border-sun-100 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    {(() => {
                      const currentParticipant = participants.find(p => p.name?.toLowerCase() === (selectedPlayer || currentUser?.name)?.toLowerCase());
                      if (currentParticipant?.photo) {
                        return <img src={currentParticipant.photo} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-[#D26E7B] shadow-2xs" />;
                      }
                      return <div className="w-7 h-7 rounded-full bg-amber-50 border border-[#EFE89F] flex items-center justify-center text-xs">{currentParticipant?.avatar || '🦕'}</div>;
                    })()}
                    <span>Joueur : <strong className="text-[#D26E7B]">{selectedPlayer || currentUser?.name}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasStarted(false)}
                    className="text-[10px] font-bold text-slate-400 hover:text-[#D26E7B] bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200 cursor-pointer"
                  >
                    Changer
                  </button>
                </div>

                {/* Category Badge & Progress */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-800 bg-sun-50 px-3 py-1 rounded-full border border-sun-200">
                    {currentQ.categoryIcon} {currentQ.category}
                  </span>

                  <span className="text-xs font-extrabold text-slate-400">
                    {currentIndex + 1} / {questions.length}
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sun-400 via-amber-500 to-mint-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>

                {/* Big Question Title */}
                <div className="text-center py-2 min-h-[80px] flex items-center justify-center">
                  <h3 className="font-serif text-base font-extrabold text-slate-800 leading-snug">
                    « {currentQ.question} »
                  </h3>
                </div>

                {/* DUEL CHOICE BUTTONS (SANS EMOJIS TÊTES & AVEC SÉLECTION PRÉCISE) */}
                {(() => {
                  const qId = currentQ.id || currentQ.questionId || (currentIndex + 1);
                  const userChoice = myVotes[qId];

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3.5">
                        <button
                          key={`btn-alizee-${qId}`}
                          type="button"
                          disabled={isVoting}
                          onClick={() => handleVote(qId, 'Alizée')}
                          className={`py-6 px-3 rounded-2xl font-black text-sm flex flex-col items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                            userChoice === 'Alizée'
                              ? 'bg-gradient-to-r from-[#D26E7B] to-[#be5361] text-white shadow-lg ring-4 ring-[#EFE89F] scale-102 font-extrabold'
                              : 'bg-[#fcf4f5] hover:bg-[#f9eaec] text-[#9f414e] border-2 border-[#ebb6bc] shadow-xs'
                          }`}
                        >
                          <span className="text-base tracking-wide font-extrabold">Plutôt Alizée</span>
                          {userChoice === 'Alizée' ? (
                            <CheckCircle2 className="w-5 h-5 stroke-[3px] text-white" />
                          ) : (
                            <span className="w-5 h-5 rounded-full border-2 border-[#ebb6bc]"></span>
                          )}
                        </button>

                        <button
                          key={`btn-lucas-${qId}`}
                          type="button"
                          disabled={isVoting}
                          onClick={() => handleVote(qId, 'Lucas')}
                          className={`py-6 px-3 rounded-2xl font-black text-sm flex flex-col items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                            userChoice === 'Lucas'
                              ? 'bg-gradient-to-r from-[#92AFEC] to-[#5578dc] text-white shadow-lg ring-4 ring-[#C5D88F] scale-102 font-extrabold'
                              : 'bg-[#f4f7fd] hover:bg-[#e8effb] text-[#354ab9] border-2 border-[#d6e2f8] shadow-xs'
                          }`}
                        >
                          <span className="text-base tracking-wide font-extrabold">Plutôt Lucas</span>
                          {userChoice === 'Lucas' ? (
                            <CheckCircle2 className="w-5 h-5 stroke-[3px] text-white" />
                          ) : (
                            <span className="w-5 h-5 rounded-full border-2 border-[#d6e2f8]"></span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-[#FFEEBC] text-xs font-bold">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Précédente</span>
                  </button>

                  <button
                    type="button"
                    disabled={currentIndex + 1 >= questions.length}
                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    className="px-3 py-1.5 rounded-xl border border-[#fcd3be] bg-[#fef6f2] text-[#b73b1a] hover:bg-[#fde9df] disabled:opacity-30 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Suivante</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : null
          )}
        </>
      )}

      {/* ======================================================== */}
      {/* 2. ONGLET RÉSULTATS DÉTAILLÉS & BILAN PAR CATÉGORIE     */}
      {/* ======================================================== */}
      {activeTab === 'results' && (
        <div className="space-y-4 animate-in zoom-in-95">
          {loading ? (
            <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-[#FFEEBC] shadow-sm">
              <div className="w-8 h-8 border-3 border-[#26422A] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-[#5D372A]">Chargement des résultats par catégorie...</p>
            </div>
          ) : (
            <>
              {/* LES 5 CATÉGORIES DÉTAILLÉES (PALMARÈS) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-serif text-sm font-black text-[#5D372A] flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#EA672D]" />
                    <span>Palmarès des Parents (Qui est le plus...) :</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold">5 titres en jeu</span>
                </div>

                {(summary.byCategory && summary.byCategory.length > 0 ? summary.byCategory : [
                  { category: "Le plus câlin", categoryIcon: "🥰", alizeePercent: 75, lucasPercent: 25, winner: "Alizée", questionsCount: 10 },
                  { category: "Le plus dépensier", categoryIcon: "🛍️", alizeePercent: 80, lucasPercent: 20, winner: "Alizée", questionsCount: 10 },
                  { category: "Le plus joueur & complice", categoryIcon: "🤪", alizeePercent: 50, lucasPercent: 50, winner: "Égalité", questionsCount: 10 },
                  { category: "Le plus aventurier & sportif", categoryIcon: "⚽", alizeePercent: 40, lucasPercent: 60, winner: "Lucas", questionsCount: 10 },
                  { category: "Le plus nocturne & patient", categoryIcon: "🌙", alizeePercent: 45, lucasPercent: 55, winner: "Lucas", questionsCount: 10 }
                ]).map((cat, i) => (
                  <div
                    key={cat.category || i}
                    className="bg-white rounded-3xl p-4 shadow-sm border border-[#FFEEBC] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{cat.categoryIcon || "👑"}</span>
                        <div>
                          <h4 className="font-serif text-xs font-black text-[#5D372A] leading-tight">
                            « {cat.category} »
                          </h4>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {cat.questionsCount || 10} questions votées
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        cat.winner === 'Alizée'
                          ? 'bg-[#fef6f2] text-[#b73b1a] border-[#fcd3be]'
                          : cat.winner === 'Lucas'
                          ? 'bg-[#f3f6f3] text-[#26422A] border-[#cbd9cb]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        👑 {cat.winner === 'Alizée' ? 'Alizée remporte' : cat.winner === 'Lucas' ? 'Lucas remporte' : '50/50 Égalité'}
                      </span>
                    </div>

                    {/* Category Gauge */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-[#b73b1a]">Alizée : {cat.alizeePercent}%</span>
                        <span className="text-[#26422A]">{cat.lucasPercent}% : Lucas</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-gradient-to-r from-[#f6895c] to-[#EA672D]"
                          style={{ width: `${cat.alizeePercent}%` }}
                        ></div>
                        <div
                          className="h-full bg-gradient-to-r from-[#466647] to-[#26422A]"
                          style={{ width: `${cat.lucasPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton pour relancer le quizz */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('play');
                    setHasStarted(false);
                    setIsFinished(false);
                    setCurrentIndex(0);
                  }}
                  className="w-full bg-sun-500 hover:bg-sun-600 text-white font-bold py-3.5 rounded-2xl shadow-md text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Faire voter un autre proche 👥</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal Nouveau Joueur */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xs w-full p-5 shadow-2xl border border-sun-200 space-y-3.5 animate-in zoom-in-95">
            <div className="text-center space-y-0.5">
              <span className="text-3xl">👤</span>
              <h3 className="font-serif text-base font-bold text-slate-800">
                Nouveau Joueur
              </h3>
              <p className="text-[11px] text-slate-400">
                Entrez votre prénom pour voter
              </p>
            </div>

            <form onSubmit={handleCreatePlayer} className="space-y-3">
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Votre prénom (ex: Célia, Tata, Lucas...)"
                autoFocus
                className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-sun-200 bg-amber-50/40 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sun-300"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="text-xs font-bold py-2 px-2.5 rounded-xl border border-sun-200 bg-white text-slate-700"
                >
                  <option value="Famille">Famille</option>
                  <option value="Ami(e)">Ami(e)</option>
                  <option value="Collègue">Collègue</option>
                  <option value="Parrain/Marraine">Parrain/Marraine</option>
                </select>

                <select
                  value={newAvatar}
                  onChange={(e) => setNewAvatar(e.target.value)}
                  className="text-xs font-bold py-2 px-2.5 rounded-xl border border-sun-200 bg-white text-slate-700"
                >
                  <option value="🦕">🦕 Dino</option>
                  <option value="🦁">🦁 Lion</option>
                  <option value="👶">👶 Bébé</option>
                  <option value="💙">💙 Cœur</option>
                  <option value="⭐">⭐ Étoile</option>
                  <option value="✨">✨ Magie</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-sun-500 hover:bg-sun-600 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
