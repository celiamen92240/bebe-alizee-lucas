import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Clock, Sparkles, Trophy, ArrowRight, Baby, Crown, Star, Flame, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser } from '../context/UserContext';
import { fruitsData } from '../data/fruitsData';

export default function HomeView({ setTab, isBorn, actualBirth }) {
  const { currentUser, setIsRegisterModalOpen } = useUser();
  const dueDate = new Date('2026-12-08T00:00:00');

  // Automatic Pregnancy Week calculation (41 weeks term ending 08/12/2026)
  const getAutoPregnancyWeek = () => {
    const totalDurationDays = 41 * 7; // 287 days
    const startDate = new Date(dueDate.getTime() - totalDurationDays * 24 * 60 * 60 * 1000);
    const now = new Date();
    const elapsedDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.max(1, Math.min(41, Math.floor(elapsedDays / 7) + 1));
    return currentWeek;
  };

  const currentWeek = getAutoPregnancyWeek();
  const fruitInfo = fruitsData.find(f => f.week === currentWeek) || fruitsData.find(f => f.week === 26) || fruitsData[0];

  // Header Photo State (Synced with Top-Left Photo)
  const [headerPhoto, setHeaderPhoto] = useState(null);

  useEffect(() => {
    const fetchPhoto = () => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings?.customHeaderPhoto) {
            setHeaderPhoto(data.settings.customHeaderPhoto);
          }
        })
        .catch(err => console.error("Error loading home photo", err));
    };

    fetchPhoto();

    const handlePhotoChanged = (e) => {
      if (e.detail) {
        setHeaderPhoto(e.detail);
      } else {
        fetchPhoto();
      }
    };

    window.addEventListener('customHeaderPhotoChanged', handlePhotoChanged);
    return () => window.removeEventListener('customHeaderPhotoChanged', handlePhotoChanged);
  }, []);

  // Real-time ticking Countdown to Due Date (08/12/2026)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +dueDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const navigate = (tabId) => {
    if (typeof setTab === 'function') {
      setTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="px-5 space-y-5 pb-6">
      {/* 1. COMPTE À REBOURS DU JOUR J */}
      <div className="bg-gradient-to-br from-[#92AFEC] via-[#a0bcf5] to-[#C5D88F] rounded-3xl p-5 shadow-lg border-2 border-white relative overflow-hidden space-y-4 text-[#1E4E42]">
        {/* Soft Decorative Glow */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6E732E] bg-[#EFE89F] px-3 py-1 rounded-full border border-white/80 flex items-center gap-1.5 w-fit shadow-xs">
              <Sparkles className="w-3 h-3 text-[#D26E7B]" />
              <span>Jour J • 08 Décembre 2026</span>
            </span>
            <h2 className="font-serif text-2xl font-black text-white tracking-tight drop-shadow-sm">
              Notre Petit Prince d'Amour
            </h2>
            <p className="text-xs text-white/95 font-medium">
              Espace familial d'<strong>Alizée & Lucas</strong> 💙
            </p>
          </div>

          <div className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-md border-2 border-white flex flex-col items-center justify-center text-center">
            <span className="text-2xl leading-none">🦕</span>
            <span className="text-[9px] font-black text-[#1E4E42] mt-1 leading-tight">Garçon</span>
          </div>
        </div>

        {/* Live Countdown Clock */}
        {!isBorn && (
          <div className="space-y-2 pt-1 relative z-10">
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 text-center shadow-md border border-[#EFE89F]">
                <span className="block font-serif text-2xl font-black text-[#D26E7B] leading-none">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] uppercase font-black text-slate-400 mt-1 block">Jours</span>
              </div>

              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 text-center shadow-md border border-[#EFE89F]">
                <span className="block font-serif text-2xl font-black text-[#92AFEC] leading-none">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-black text-slate-400 mt-1 block">Heures</span>
              </div>

              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 text-center shadow-md border border-[#EFE89F]">
                <span className="block font-serif text-2xl font-black text-[#92AFEC] leading-none">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-black text-slate-400 mt-1 block">Min</span>
              </div>

              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 text-center shadow-md border border-[#EFE89F]">
                <span className="block font-serif text-2xl font-black text-[#D26E7B] leading-none animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-black text-slate-400 mt-1 block">Sec</span>
              </div>
            </div>

            {/* Pregnancy Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-black text-white">
                <span>Début</span>
                <span className="bg-[#EFE89F] text-[#6E732E] px-2.5 py-0.5 rounded-full text-[10px] shadow-2xs font-black">
                  {Math.round((currentWeek / 41) * 100)}% parcouru
                </span>
                <span>08/12</span>
              </div>
              <div className="w-full h-3 bg-black/15 rounded-full overflow-hidden p-0.5 shadow-inner backdrop-blur-xs">
                <div
                  className="h-full bg-gradient-to-r from-[#D26E7B] via-[#EFE89F] to-[#92AFEC] rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.round((currentWeek / 41) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. ÉVOLUTION DU BÉBÉ (DESIGN COMPACT, ÉPURÉ & PEP'S) */}
      <div className="bg-gradient-to-br from-[#EFE89F]/40 via-white to-[#C5D88F]/30 rounded-3xl p-5 shadow-md border-2 border-[#C5D88F] space-y-3.5 relative overflow-hidden">
        {/* Header Title Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl p-1.5 bg-[#EFE89F] rounded-xl shadow-2xs">🌱</span>
            <h3 className="font-serif text-sm font-black text-[#1E4E42]">
              Évolution semaine après semaine
            </h3>
          </div>
          <span className="text-[11px] font-black text-[#1E4E42] bg-[#EFE89F] border border-white/80 rounded-xl px-3 py-1 flex items-center gap-1 shadow-sm whitespace-nowrap flex-shrink-0">
            <span>✨ Sem. {currentWeek}</span>
          </span>
        </div>

        {/* Fruit Detail Content */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#C5D88F]/60 flex items-center gap-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EFE89F]/60 to-[#C5D88F]/40 shadow-xs border-2 border-[#C5D88F] flex items-center justify-center text-4xl flex-shrink-0 animate-bounce-subtle">
            {fruitInfo.emoji}
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm text-[#1E4E42]">
                Comme {fruitInfo.fruit}
              </span>
              <span className="text-[10px] bg-[#EFE89F] text-[#6E732E] px-2.5 py-0.5 rounded-full font-extrabold whitespace-nowrap flex-shrink-0">
                Sem. {currentWeek}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#92AFEC] font-bold whitespace-nowrap">
              <span>📏 {fruitInfo.sizeCm} cm</span>
              <span>•</span>
              <span>⚖️ ~{fruitInfo.weightG} g</span>
            </div>

            <p className="text-[11px] text-slate-600 italic leading-snug">
              « {fruitInfo.desc} »
            </p>
          </div>
        </div>
      </div>

      {/* 3. Raccourcis Activités & Jeux (Color-blocked 6 Palettes de l'Image) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-serif text-xs font-black text-[#1E4E42] uppercase tracking-wider">
            Activités & Jeux en Famille
          </h3>
          <span className="text-[10px] text-[#D26E7B] font-black">Cliquez pour jouer !</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Raccourci 1: Grand Prono (Dusty Rose - Slaughter Haus) */}
          <button
            type="button"
            onClick={() => navigate('predictions')}
            className="bg-gradient-to-br from-[#D26E7B] to-[#be5361] text-white p-4 rounded-3xl shadow-md border-2 border-white hover:shadow-lg active:scale-95 text-left transition-all group flex flex-col justify-between h-30 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <span className="text-3xl p-1 bg-white/20 rounded-2xl">🎯</span>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <p className="font-serif font-black text-sm text-white">Grand Prono</p>
              <p className="text-[10px] text-white/90 font-medium">Paris sur le jour J & prénom</p>
            </div>
          </button>

          {/* Raccourci 2: Qui d'Alizée ou de Lucas ? (Synchronisé avec la photo du haut) */}
          <button
            type="button"
            onClick={() => navigate('quiz')}
            className="bg-gradient-to-br from-[#C5D88F] to-[#a8c668] text-[#1E4E42] p-4 rounded-3xl shadow-md border-2 border-white hover:shadow-lg active:scale-95 text-left transition-all group flex flex-col justify-between h-30 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-white/80 p-0.5 shadow-2xs border border-white/90 overflow-hidden flex items-center justify-center flex-shrink-0">
                {headerPhoto ? (
                  <img src={headerPhoto} alt="Alizée & Lucas" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <img src="/logo.jpg" alt="Alizée & Lucas" className="w-full h-full object-cover rounded-xl" />
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-[#1E4E42]/80 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <p className="font-serif font-black text-sm text-[#1E4E42] leading-tight">Qui d'Alizée ou de Lucas ?</p>
              <p className="text-[10px] text-[#1E4E42]/90 font-medium">Duel des futurs parents</p>
            </div>
          </button>

          {/* Raccourci 3: Jeux & Mots Fléchés (Periwinkle Blue - Sun Club) */}
          <button
            type="button"
            onClick={() => navigate('games')}
            className="bg-gradient-to-br from-[#92AFEC] to-[#7194e4] text-white p-4 rounded-3xl shadow-md border-2 border-white hover:shadow-lg active:scale-95 text-left transition-all group flex flex-col justify-between h-30 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <span className="text-3xl p-1 bg-white/20 rounded-2xl">🧩</span>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <p className="font-serif font-black text-sm text-[#EFE89F]">Mots Fléchés</p>
              <p className="text-[10px] text-white/90 font-medium">12 mots & chrono ⏱️</p>
            </div>
          </button>

          {/* Raccourci 4: Hésitations & Dilemmes (Butter Yellow - Raine's Creative) */}
          <button
            type="button"
            onClick={() => navigate('polls')}
            className="bg-gradient-to-br from-[#EFE89F] to-[#dac94e] text-[#5f4d21] p-4 rounded-3xl shadow-md border-2 border-white hover:shadow-lg active:scale-95 text-left transition-all group flex flex-col justify-between h-30 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <span className="text-3xl p-1 bg-white/40 rounded-2xl">💡</span>
              <ArrowRight className="w-4 h-4 text-[#5f4d21]/80 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <p className="font-serif font-black text-sm text-[#5f4d21]">Hésitations</p>
              <p className="text-[10px] text-[#5f4d21]/90 font-medium">Aidez Alizée & Lucas</p>
            </div>
          </button>
        </div>

        {/* Raccourci 5: Capsule d'Amour / Livre d'or (Lavender Pink - Garden Variety) */}
        <button
          type="button"
          onClick={() => navigate('guestbook')}
          className="w-full bg-gradient-to-r from-[#ECCEE6]/60 via-white to-[#ECCEE6]/40 p-4 rounded-3xl shadow-md border-2 border-[#ECCEE6] hover:border-[#D26E7B] active:scale-[0.99] flex items-center justify-between group transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1 bg-white rounded-2xl shadow-2xs">💌</span>
            <div className="text-left">
              <p className="font-serif font-black text-sm text-[#5e3052]">Capsule d'Amour & Mots Doux</p>
              <p className="text-[10px] text-[#863e75]">Laissez un message plein de tendresse pour sa naissance</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#D26E7B] group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Raccourci 6: Espace Parents (Vanilla Cream - Churn) */}
        <button
          type="button"
          onClick={() => navigate('parents')}
          className="w-full bg-gradient-to-r from-[#FEFCE7] via-white to-[#f4f7fe] p-4 rounded-3xl shadow-xs border-2 border-[#92AFEC]/70 hover:border-[#D26E7B] active:scale-[0.99] flex items-center justify-between group transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EFE89F] to-[#92AFEC] shadow-2xs border border-white flex items-center justify-center overflow-hidden">
              {headerPhoto ? (
                <img src={headerPhoto} alt="Photo Parents" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Lock className="w-5 h-5 text-[#1E4E42]" />
              )}
            </div>
            <div className="text-left">
              <p className="font-serif font-black text-sm text-[#1E4E42] flex items-center gap-1.5">
                <span>Espace Parents</span>
                <Lock className="w-3.5 h-3.5 text-[#D26E7B]" />
              </p>
              <p className="text-[10px] text-slate-500 font-medium">Organisation privée pour Alizée & Lucas</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#D26E7B] group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  );
}
