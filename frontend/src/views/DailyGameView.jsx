import React, { useState, useEffect, useRef } from 'react';
import { Timer, Trophy, Play, CheckCircle2, XCircle, RotateCcw, Sparkles, Flame, ArrowRight, HelpCircle, Award, Calendar, Star, Zap, Eye, Check, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser } from '../context/UserContext';
import ParticipantSelector from '../components/ParticipantSelector';

export default function DailyGameView() {
  const { currentUser, setIsRegisterModalOpen } = useUser();
  const [gridData, setGridData] = useState(null);
  const [todayScores, setTodayScores] = useState([]);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [leaderboardTab, setLeaderboardTab] = useState('today'); // 'today' or 'global'
  
  const [playerName, setPlayerName] = useState(currentUser?.name || '');
  
  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTenths, setElapsedTenths] = useState(0); // 100ms units
  const [userInputs, setUserInputs] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultDetails, setResultDetails] = useState(null);

  const timerRef = useRef(null);

  const fetchDailyData = () => {
    fetch('/api/crosswords/daily')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGridData(data.grid);
          setTodayScores(data.todayScores || []);
          setGlobalLeaderboard(data.globalLeaderboard || []);
        }
      })
      .catch(err => console.error("Error loading daily crosswords", err));
  };

  useEffect(() => {
    fetchDailyData();
  }, []);

  useEffect(() => {
    if (currentUser?.name) {
      setPlayerName(currentUser.name);
    }
  }, [currentUser]);

  // Chronometer Ticking
  useEffect(() => {
    if (isPlaying && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setElapsedTenths(prev => prev + 1);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isSubmitted]);

  const formatTime = (tenths) => {
    const totalSec = Math.floor(tenths / 10);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const dec = tenths % 10;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${dec}`;
  };

  // Check if player has already completed today's official challenge
  const todayPlayerScore = todayScores.find(
    s => s.playerName?.toLowerCase() === (playerName || currentUser?.name || '').toLowerCase()
  );

  const handleStartGame = () => {
    const pName = playerName || currentUser?.name;
    if (!pName || !pName.trim()) {
      setIsRegisterModalOpen(true);
      return;
    }
    if (todayPlayerScore) return;

    setIsPlaying(true);
    setIsSubmitted(false);
    setResultDetails(null);
    setElapsedTenths(0);
    setUserInputs({});
  };

  const handleWordInputChange = (wordId, value) => {
    if (!gridData || !gridData.words) return;
    const targetWord = gridData.words.find(w => w.id === wordId);
    if (!targetWord) return;

    const cleaned = value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, targetWord.length);
    setUserInputs(prev => ({ ...prev, [wordId]: cleaned }));
  };

  // Player confirms their choices without knowing the answers in advance!
  const handleSubmitGrid = async () => {
    if (!gridData || !gridData.words) return;
    
    setIsSubmitted(true);
    setIsPlaying(false);

    // Calculate correct answers
    const answers = gridData.words.map(w => {
      const typed = (userInputs[w.id] || '').trim().toUpperCase();
      const isCorrect = typed === w.word.toUpperCase();
      return {
        id: w.id,
        clue: w.clue,
        word: w.word,
        typed: typed,
        length: w.length,
        isCorrect: isCorrect
      };
    });

    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalWords = gridData.words.length;
    const timeSeconds = parseFloat((elapsedTenths / 10).toFixed(1));
    const timeFormatted = formatTime(elapsedTenths);

    if (correctCount >= 6) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#facc15', '#4ade80', '#eab308', '#22c55e']
      });
    }

    const pName = playerName || currentUser?.name || 'Un proche';

    try {
      const res = await fetch('/api/crosswords/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: pName,
          timeSeconds,
          timeFormatted,
          correctCount,
          totalWords,
          theme: gridData.theme || 'Mots Fléchés',
          date: gridData.date
        })
      });
      const data = await res.json();
      if (data.success) {
        setResultDetails({
          correctCount: data.correctCount !== undefined ? data.correctCount : correctCount,
          totalWords: data.totalWords || totalWords,
          awardedPoints: data.awardedPoints,
          timeFormatted,
          alreadySubmitted: data.alreadySubmitted,
          answers
        });
        setTodayScores(data.todayScores || []);
        setGlobalLeaderboard(data.globalLeaderboard || []);
      }
    } catch (err) {
      console.error("Error submitting crossword score", err);
      setResultDetails({
        correctCount,
        totalWords,
        awardedPoints: correctCount * 60,
        timeFormatted,
        answers
      });
    }
  };

  const filledCount = gridData?.words?.filter(w => (userInputs[w.id] || '').trim().length > 0).length || 0;
  const totalWords = gridData?.words?.length || 12;

  return (
    <div className="px-5 space-y-5 pb-8">
      {/* Header Banner */}
      <div className="glass-card-sun rounded-3xl p-5 border border-sun-300 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sun-800 bg-white/80 px-2.5 py-0.5 rounded-full border border-sun-200 flex items-center gap-1 w-fit">
              <Calendar className="w-3 h-3 text-sun-600" />
              <span>Défi du Jour • 12 Mots</span>
            </span>
            <h2 className="font-serif text-xl font-extrabold text-[#1E4E42]">
              Mots Fléchés Quotidiens
            </h2>
            <p className="text-xs text-[#1E4E42]/80 font-medium">
              Bébé, enfants, Noël, famille & aventures ! 1 tentative officielle par jour.
            </p>
          </div>
          <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-2xl object-cover shadow-2xs border border-[#C5D88F]" />
        </div>

        {/* Today's Theme Pill (Toujours sur la même ligne) */}
        {gridData && (
          <div className="mt-3 bg-white/95 rounded-2xl px-3 py-2 border border-[#EFE89F] flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs whitespace-nowrap overflow-hidden">
              <span className="font-bold text-slate-500">Thème :</span>
              <strong className="text-[#D26E7B] font-black truncate">{gridData.theme}</strong>
            </div>
            <span className="text-[10px] font-bold text-[#1E4E42] bg-[#EFE89F] px-2 py-0.5 rounded-md whitespace-nowrap flex-shrink-0 border border-[#C5D88F]">
              12 définitions
            </span>
          </div>
        )}
      </div>

      {/* CHRONOMETER BAR */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-[#EFE89F] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">
            Joueur : <strong className="text-[#D26E7B]">{playerName || currentUser?.name || "Non défini"}</strong>
          </span>
        </div>

        <div className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black font-mono transition-all ${
          isPlaying && !isSubmitted
            ? 'bg-red-500 text-white animate-pulse shadow-md scale-105'
            : 'bg-slate-100 text-slate-600'
        }`}>
          <Timer className="w-3.5 h-3.5" />
          <span>{formatTime(elapsedTenths)}</span>
        </div>
      </div>

      {/* 1. ÉCRAN INTRO : DÉMARRER OU VOIR SON SCORE DÉJÀ ENREGISTRÉ */}
      {!isPlaying && !isSubmitted && (
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-[#EFE89F] text-center space-y-4 animate-in zoom-in-95">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-[#D26E7B]/20 via-[#EFE89F]/40 to-[#C5D88F]/30 border border-[#C5D88F]/50 flex items-center justify-center text-[#D26E7B] shadow-2xs">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-lg font-black text-[#1E4E42]">
              Défi Mots Fléchés du Jour
            </h3>
            <p className="text-xs text-amber-800 font-medium">
              « {gridData?.description || "Trouve les 12 mots le plus vite possible !"} »
            </p>
          </div>

          {/* If player already played today -> Lock message (Anti-Cheat!) */}
          {todayPlayerScore ? (
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-left space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Score officiel déjà enregistré aujourd'hui !</span>
              </div>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-100 text-xs">
                <span className="text-slate-600 font-medium">
                  {todayPlayerScore.playerName} • {todayPlayerScore.correctCount !== undefined ? `${todayPlayerScore.correctCount}/12 trouvés` : '12 mots'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-700 font-bold">⏱️ {todayPlayerScore.timeFormatted}</span>
                  <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+{todayPlayerScore.points} pts</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Anti-triche actif : 1 tentative par jour pour préserver l'équité du podium ! Rendez-vous demain pour la nouvelle grille.
              </p>
            </div>
          ) : (
            <div className="bg-amber-50/50 rounded-2xl p-3.5 border border-sun-200 text-left text-xs space-y-1.5 text-slate-600">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Règles du Défi :</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                • <strong>Remplis ce que tu trouves</strong> et clique sur Valider (même si tu n'as pas tout mis).<br />
                • <strong>Tes réponses restent secrètes</strong> jusqu'à la fin de la partie.<br />
                • <strong>Score verrouillé</strong> dès validation pour un classement 100% honnête !<br />
                • Ceux qui ne jouent pas un jour n'ont pas les points du jour.
              </p>
            </div>
          )}

          {/* Participant Selection */}
          <div className="text-left bg-amber-50/40 rounded-2xl p-3 border border-sun-200">
            <ParticipantSelector
              selectedName={playerName}
              onSelect={(name) => setPlayerName(name)}
              label="Sélectionne ton profil :"
            />
          </div>

          {!todayPlayerScore && (
            <button
              type="button"
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-[#D26E7B] to-[#be5361] text-white font-bold py-4 rounded-2xl shadow-lg text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Démarrer 🚀</span>
            </button>
          )}
        </div>
      )}

      {/* 2. ÉCRAN EN JEU : GRILLE DE 12 MOTS EN COURS DE SAISIE */}
      {isPlaying && !isSubmitted && gridData && (
        <div className="space-y-4 animate-in zoom-in-95">
          <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-sun-300 space-y-4">
            <div className="flex items-center justify-between border-b border-sun-100 pb-2">
              <span className="text-xs font-black text-slate-800">
                12 Définitions à Compléter
              </span>
              <span className="text-[10px] font-extrabold text-sun-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-sun-200">
                {filledCount} / {totalWords} renseignés
              </span>
            </div>

            {/* List of 12 Crossword Definitions */}
            <div className="space-y-3">
              {gridData.words.map((item) => {
                const currentVal = userInputs[item.id] || '';

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-sun-200 bg-amber-50/20 transition-all focus-within:border-sun-400 focus-within:bg-white focus-within:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        {item.clue}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-sun-200 flex-shrink-0">
                        {item.length} let.
                      </span>
                    </div>

                    {/* Letter Input Box (NO live green checkmarks!) */}
                    <input
                      type="text"
                      maxLength={item.length}
                      value={currentVal}
                      onChange={(e) => handleWordInputChange(item.id, e.target.value)}
                      placeholder={`Tape le mot (${item.length} lettres)...`}
                      className="w-full text-xs font-mono font-bold tracking-widest px-3 py-2.5 rounded-xl border border-sun-200 bg-white text-slate-800 uppercase outline-none focus:ring-2 focus:ring-sun-400 shadow-2xs transition-all placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-sans"
                    />
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmitGrid}
                className="w-full bg-gradient-to-r from-sun-500 via-amber-500 to-mint-600 hover:from-sun-600 hover:to-mint-700 text-white font-black py-4 rounded-2xl shadow-xl text-sm transition-all flex items-center justify-center gap-2 glow-sun cursor-pointer active:scale-95"
              >
                <Check className="w-5 h-5 stroke-[3px]" />
                <span>Valider</span>
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-2">
                Attention : ton score sera figé et non modifiable une fois validé !
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. ÉCRAN RÉSULTATS DÉTAILLÉS & CORRIGÉ APRÈS VALIDATION */}
      {isSubmitted && resultDetails && (
        <div className="space-y-4 animate-in zoom-in-95">
          <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-sun-300 text-center space-y-4">
            <span className="text-5xl">
              {resultDetails.correctCount >= 10 ? '👑 🎉' : resultDetails.correctCount >= 6 ? '👏 ✨' : '💪 🦕'}
            </span>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-black text-slate-800">
                Résultats de {playerName || currentUser?.name}
              </h3>
              <p className="text-xs text-sun-800 font-medium">
                Temps : <strong>{resultDetails.timeFormatted}</strong> • <strong>{resultDetails.correctCount} / {resultDetails.totalWords}</strong> mots corrects !
              </p>
            </div>

            {/* Score Box */}
            <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-emerald-50 rounded-2xl p-4 border border-sun-200 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Points Marqués Aujourd'hui</span>
              <p className="font-serif text-3xl font-black text-sun-700 flex items-center justify-center gap-1">
                <span>+{resultDetails.awardedPoints}</span>
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                Verrouillés et ajoutés à ton classement général !
              </p>
            </div>

            {/* Detailed Answers Review (Corrigé des 12 mots) */}
            <div className="text-left space-y-2.5 pt-2">
              <p className="font-serif text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-sun-600" />
                <span>Détail de tes réponses & Corrigé :</span>
              </p>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {resultDetails.answers.map((ans, idx) => (
                  <div
                    key={ans.id || idx}
                    className={`p-3 rounded-2xl border text-xs transition-all ${
                      ans.isCorrect
                        ? 'bg-green-50/80 border-green-200 text-green-950'
                        : 'bg-rose-50/50 border-rose-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-[11px] font-bold text-slate-700 leading-tight">
                        {ans.clue}
                      </p>
                      {ans.isCorrect ? (
                        <span className="text-[10px] font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Exact (+60 pts)</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                          <XCircle className="w-3 h-3" />
                          <span>Manqué</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/50">
                      <span className="text-slate-500 font-medium">
                        Ta réponse : <strong className={ans.isCorrect ? "text-green-700 font-mono" : "text-rose-600 line-through font-mono"}>
                          {ans.typed || "(vide)"}
                        </strong>
                      </span>
                      {!ans.isCorrect && (
                        <span className="text-sun-800 font-extrabold font-mono bg-white px-2 py-0.5 rounded-md border border-sun-200 shadow-2xs">
                          Solution : {ans.word}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => { setIsPlaying(false); setIsSubmitted(false); setResultDetails(null); }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Passer au joueur suivant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. LES DEUX CLASSEMENTS (SANS BOUTON SUPPRESSION = ANTI-TRICHE) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-sun-200 space-y-4">
        {/* Leaderboard Tabs Switcher */}
        <div className="flex items-center justify-between border-b border-sun-100 pb-2">
          <div className="flex items-center gap-1.5 bg-amber-50/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setLeaderboardTab('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                leaderboardTab === 'today'
                  ? 'bg-white text-sun-800 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#D26E7B]" />
              <span>Podium du Jour</span>
            </button>
            <button
              type="button"
              onClick={() => setLeaderboardTab('global')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                leaderboardTab === 'global'
                  ? 'bg-white text-sun-800 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#D26E7B]" />
              <span>Classement Général</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PODIUM DU JOUR */}
        {leaderboardTab === 'today' && (
          <div className="space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
              <span>Joueurs d'aujourd'hui</span>
              <span>Temps & Points</span>
            </div>

            {todayScores.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EFE89F]/30 border border-[#C5D88F]/50 flex items-center justify-center text-[#D26E7B] shadow-2xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">Aucun score enregistré aujourd'hui</p>
                <p className="text-[10px] text-slate-400">Sois le premier à relever la grille de 12 mots !</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayScores.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold ${
                      idx === 0
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950 shadow-2xs'
                        : idx === 1
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-amber-50/30 border-sun-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-xl shadow-2xs flex items-center justify-center text-xs font-black ${
                        idx === 0 ? 'bg-[#FFE066] text-[#78350f] border border-white' : idx === 1 ? 'bg-slate-200 text-slate-700' : idx === 2 ? 'bg-amber-200/80 text-amber-800' : 'bg-white text-slate-400'
                      }`}>
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="text-slate-800 font-extrabold">{s.playerName}</p>
                        <p className="text-[9px] text-slate-400 font-normal">
                          {s.correctCount !== undefined ? `${s.correctCount}/12 trouvés` : '12 mots'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded-lg border border-sun-100 flex items-center gap-1">
                        <Timer className="w-3 h-3 text-slate-400" />
                        <span>{s.timeFormatted}</span>
                      </span>
                      <span className="font-black text-sun-800 bg-amber-100 px-2 py-0.5 rounded-lg">
                        +{s.points} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CLASSEMENT GÉNÉRAL ÉVOLUTIF (CUMUL DES JOURS) */}
        {leaderboardTab === 'global' && (
          <div className="space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
              <span>Famille & Proches</span>
              <span>Points Cumulés</span>
            </div>

            {globalLeaderboard.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#92AFEC]/20 border border-[#92AFEC]/40 flex items-center justify-center text-[#92AFEC] shadow-2xs">
                  <Trophy className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">Le classement général démarre</p>
                <p className="text-[10px] text-slate-400">Joue chaque jour pour cumuler des points !</p>
              </div>
            ) : (
              <div className="space-y-2">
                {globalLeaderboard.map((item, idx) => (
                  <div
                    key={item.playerName || idx}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold ${
                      idx === 0
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950 shadow-2xs ring-1 ring-amber-300'
                        : idx === 1
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-amber-50/30 border-sun-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-xl shadow-2xs flex items-center justify-center text-xs font-black ${
                        idx === 0 ? 'bg-[#FFE066] text-[#78350f] border border-white' : idx === 1 ? 'bg-slate-200 text-slate-700' : idx === 2 ? 'bg-amber-200/80 text-amber-800' : 'bg-white text-slate-400'
                      }`}>
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="font-extrabold text-slate-800">{item.playerName}</p>
                        <p className="text-[9px] text-slate-400 font-medium">
                          {item.daysPlayed} jour{item.daysPlayed > 1 ? 's' : ''} joué{item.daysPlayed > 1 ? 's' : ''} • Record : {item.bestTimeFormatted}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-sm text-sun-800 bg-amber-100 px-2.5 py-1 rounded-xl border border-sun-200">
                        {item.totalPoints} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
