import React, { useState, useEffect } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, RotateCcw, ChevronLeft, ChevronRight, Trophy, User, ArrowRight, UserCheck, BarChart3, Award, Heart, ShoppingBag, Smile, Compass, Moon, Users, UserPlus } from 'lucide-react';
import confetti from 'canvas-confetti';
import ParticipantSelector from '../components/ParticipantSelector';

const getCategoryIcon = (categoryName, iconClass = "w-4 h-4") => {
  const cat = (categoryName || '').toLowerCase();
  if (cat.includes('câlin') || cat.includes('calin') || cat.includes('amour') || cat.includes('tendre')) {
    return <Heart className={`${iconClass} text-[#D26E7B]`} />;
  }
  if (cat.includes('dépensier') || cat.includes('depensier') || cat.includes('achat') || cat.includes('shopping')) {
    return <ShoppingBag className={`${iconClass} text-[#d29b26]`} />;
  }
  if (cat.includes('joueur') || cat.includes('complice') || cat.includes('fou') || cat.includes('rire')) {
    return <Smile className={`${iconClass} text-[#8b5cf6]`} />;
  }
  if (cat.includes('aventurier') || cat.includes('sportif') || cat.includes('sport')) {
    return <Compass className={`${iconClass} text-[#2563eb]`} />;
  }
  if (cat.includes('nocturne') || cat.includes('patient') || cat.includes('nuit')) {
    return <Moon className={`${iconClass} text-[#1E4E42]`} />;
  }
  return <Sparkles className={`${iconClass} text-[#D26E7B]`} />;
};

const getCategoryBg = (categoryName) => {
  const cat = (categoryName || '').toLowerCase();
  if (cat.includes('câlin') || cat.includes('calin')) return "bg-[#fcf4f5] border-[#ebb6bc]";
  if (cat.includes('dépensier') || cat.includes('depensier')) return "bg-[#FEFCE7] border-[#EFE89F]";
  if (cat.includes('joueur') || cat.includes('complice')) return "bg-[#f3e8ff] border-[#d8b4fe]";
  if (cat.includes('aventurier') || cat.includes('sportif')) return "bg-[#eff6ff] border-[#bfdbfe]";
  if (cat.includes('nocturne') || cat.includes('patient')) return "bg-[#C5D88F]/20 border-[#C5D88F]/50";
  return "bg-[#FEFCE7] border-[#EFE89F]";
};

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

  const hasAlreadyCompleted = Boolean(
    selectedPlayer && (
      (summary?.completedVoters || []).some(v => (v || '').toLowerCase() === selectedPlayer.toLowerCase()) ||
      localStorage.getItem(`quiz_completed_alizee_${selectedPlayer.toLowerCase()}`) === 'true' ||
      (Object.keys(myVotes).length >= (questions.length || 50) && questions.length > 0)
    )
  );

  const handleStart = (readOnlyMode = false) => {
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
    if (hasAlreadyCompleted) {
      // Mode lecture seule si déjà complété
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setActiveTab('results');
      }
      return;
    }

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
    setTimeout(async () => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // FIN DU QUIZZ -> Clôture officielle pour ce joueur (1 seule participation)
        localStorage.setItem(`quiz_completed_alizee_${voter.toLowerCase()}`, 'true');
        try {
          await fetch('/api/quiz/finish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voter })
          });
        } catch (e) {
          console.error(e);
        }

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
    <div className="px-5 space-y-5 pb-8">
      {/* Header Banner - Titre unique sans onglets */}
      <div className="bg-gradient-to-br from-[#EFE89F]/35 via-white to-[#C5D88F]/40 rounded-3xl p-5 border-2 border-[#C5D88F] shadow-md relative overflow-hidden space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6E732E] bg-[#EFE89F] px-2.5 py-0.5 rounded-full border border-white/80 flex items-center gap-1 shadow-2xs">
              <span>Duel des Parents • 50 Questions</span>
            </span>
            
            <span className="text-[10px] font-bold text-slate-600 bg-white/70 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#C5D88F]/60 flex items-center shadow-2xs">
              {(summary.uniqueVotersCount || 0) === 1 ? '1 participant' : `${summary.uniqueVotersCount || 0} participants`}
            </span>
          </div>

          <h2 className="font-serif text-2xl font-black text-[#1E4E42] tracking-tight leading-tight pt-0.5">
            Qui d'Alizée ou de Lucas ?
          </h2>
          <p className="text-xs text-[#1E4E42]/80 font-medium">
            Votez et découvrez qui remportera les 5 grands titres de super parents ! (1 participation par proche)
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. SECTION VOTE AU QUIZ (SÉLECTION JOUEUR OU QUESTIONS) */}
      {/* ======================================================== */}
      {!hasStarted ? (
        /* ÉCRAN 0 : SÉLECTION DU JOUEUR */
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-[#C5D88F] text-center space-y-4 animate-in zoom-in-95">
          <div className="space-y-1">
            <h3 className="font-serif text-base font-black text-[#1E4E42]">
              Prêt(e) à voter pour ce duel ?
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Sélectionne ton profil ci-dessous pour enregistrer tes choix
            </p>
          </div>

          {/* Sélection du joueur propre et élégante */}
          <div className="text-left pt-1">
            <ParticipantSelector
              selectedName={selectedPlayer}
              onSelect={(name) => handleSelectPlayer(name)}
              label="Qui participe au quiz ?"
            />
          </div>

          {/* Message si ce joueur a déjà complété le quiz */}
          {hasAlreadyCompleted ? (
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center space-y-3">
              <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-extrabold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{selectedPlayer}, vous avez déjà répondu à ce Quiz !</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">
                Vos votes ont été définitivement comptabilisés dans le duel.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setHasStarted(true);
                    setActiveTab('results');
                  }}
                  className="bg-[#1E4E42] hover:bg-[#153830] text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-xs cursor-pointer transition-all"
                >
                  Voir les résultats
                </button>
                <button
                  type="button"
                  onClick={() => handleStart(true)}
                  className="bg-white text-[#1E4E42] border border-[#C5D88F] font-bold py-2.5 px-3 rounded-xl text-xs hover:bg-emerald-50 cursor-pointer transition-all"
                >
                  Revoir mes choix 👀
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleStart(false)}
              className="w-full bg-gradient-to-r from-[#1E4E42] to-[#2d6a4f] text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Lancer le Duel</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : isFinished ? (
        /* ÉCRAN FIN DU QUIZ */
        <div className="bg-gradient-to-br from-[#EFE89F]/30 via-white to-[#C5D88F]/40 rounded-3xl p-6 shadow-md border-2 border-[#C5D88F] text-center space-y-3.5 animate-in zoom-in-95">
          <span className="text-4xl block">🎉</span>
          <h3 className="font-serif text-lg font-black text-[#1E4E42]">
            Merci pour ton vote {selectedPlayer} !
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Tes réponses ont été enregistrées et intégrées aux tendances ci-dessous.
          </p>

          <button
            type="button"
            onClick={() => {
              setHasStarted(false);
              setIsFinished(false);
              setCurrentIndex(0);
            }}
            className="w-full bg-gradient-to-r from-[#D26E7B] to-[#be5361] text-white font-black py-4 rounded-2xl shadow-lg border-2 border-white flex items-center justify-center gap-2 text-sm uppercase tracking-wide cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
          >
            <UserPlus className="w-5 h-5 text-white" />
            <span>Faire voter un autre proche</span>
          </button>
        </div>
      ) : (
        /* QUESTION ACTIVE DU QUIZ */
        currentQ ? (
          <div key={`question-card-${currentQ.id || currentIndex}`} className="bg-white rounded-3xl p-5 shadow-lg border-2 border-[#EFE89F] space-y-4 relative overflow-hidden animate-in fade-in zoom-in-95">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-sun-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                {(() => {
                  const currentParticipant = participants.find(p => p.name?.toLowerCase() === (selectedPlayer || 'Maman')?.toLowerCase());
                  if (currentParticipant?.photo) {
                    return <img src={currentParticipant.photo} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-[#D26E7B] shadow-2xs" />;
                  }
                  return <div className="w-7 h-7 rounded-full bg-amber-50 border border-[#EFE89F] flex items-center justify-center text-xs">{currentParticipant?.avatar || '🦕'}</div>;
                })()}
                <span>Joueur : <strong className="text-[#D26E7B]">{selectedPlayer || 'Un proche'}</strong></span>
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
              <span className="text-xs font-extrabold text-amber-800 bg-sun-50 px-3 py-1 rounded-full border border-sun-200 flex items-center gap-1.5 shadow-2xs">
                {getCategoryIcon(currentQ.category, "w-3.5 h-3.5")}
                <span>{currentQ.category}</span>
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

            {/* DUEL CHOICE BUTTONS */}
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

      {/* ======================================================== */}
      {/* 2. SECTION RÉSULTATS & TENDANCES EN DESSOUS              */}
      {/* ======================================================== */}
      <div className="space-y-4 pt-1">
        {/* En-tête Palmarès sur une seule et même ligne */}
        <div className="flex items-center justify-between px-1 gap-2">
          <h3 className="font-serif text-[11px] sm:text-sm font-black text-[#1E4E42] flex items-center gap-1.5 whitespace-nowrap min-w-0">
            <Award className="w-4 h-4 text-[#D26E7B] flex-shrink-0" />
            <span className="truncate">Palmarès des parents : qui est le + ?</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap flex-shrink-0">5 thématiques</span>
        </div>

        {/* 5 Cartes de Catégories */}
        {(summary.byCategory && summary.byCategory.length > 0 ? summary.byCategory : [
          { category: "Le plus câlin", alizeePercent: 75, lucasPercent: 25, questionsCount: 10 },
          { category: "Le plus dépensier", alizeePercent: 80, lucasPercent: 20, questionsCount: 10 },
          { category: "Le plus joueur & complice", alizeePercent: 50, lucasPercent: 50, questionsCount: 10 },
          { category: "Le plus aventurier & sportif", alizeePercent: 40, lucasPercent: 60, questionsCount: 10 },
          { category: "Le plus nocturne & patient", alizeePercent: 45, lucasPercent: 55, questionsCount: 10 }
        ]).map((cat, i) => (
          <div
            key={cat.category || i}
            className="bg-white rounded-3xl p-4 shadow-sm border border-[#FFEEBC] space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border shadow-2xs flex-shrink-0 ${getCategoryBg(cat.category)}`}>
                {getCategoryIcon(cat.category, "w-4 h-4")}
              </div>
              <div>
                <h4 className="font-serif text-xs font-black text-[#5D372A] leading-tight">
                  « {cat.category} »
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">
                  {cat.questionsCount || 10} questions votées
                </span>
              </div>
            </div>

            {/* Category Gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-[#b73b1a]">Alizée : {cat.alizeePercent}%</span>
                <span className="text-[#26422A]">{cat.lucasPercent}% : Lucas</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
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
    </div>
  );
}
