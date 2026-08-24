import React, { useState, useEffect } from 'react';
import {
  Heart, Sparkles, Trophy, MessageSquareText,
  CalendarHeart, ArrowRight, Lightbulb, ChevronRight, Lock, Mail, Sprout, MailOpen, Puzzle, ShieldCheck
} from 'lucide-react';
import BabyVectorLogo from '../components/BabyVectorLogo';
import FruitIllustration from '../components/FruitIllustration';
import confetti from 'canvas-confetti';
import { useUser } from '../context/UserContext';
import { fruitsData } from '../data/fruitsData';
import { getTodayDailyFact } from '../data/dailyFacts';

export default function HomeView({ setTab, isBorn, actualBirth }) {
  const { currentUser, setIsRegisterModalOpen } = useUser();
  const dueDate = new Date('2026-12-08T00:00:00');
  const [dailyFact, setDailyFact] = useState(() => getTodayDailyFact());

  useEffect(() => {
    setDailyFact(getTodayDailyFact());
  }, []);

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

          <div className="flex items-center justify-center relative">
            <BabyVectorLogo gender="boy" size={62} className="drop-shadow-md hover:scale-110 transition-transform" />
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
      <div className="bg-gradient-to-br from-[#EFE89F]/40 via-white to-[#C5D88F]/30 rounded-3xl p-5 shadow-md border-2 border-[#C5D88F] space-y-3 relative overflow-hidden">
        {/* Header Title Row sur une seule ligne épurée */}
        <div>
          <h3 className="font-serif text-xs font-black text-[#1E4E42] tracking-wide">
            Évolution semaine après semaine
          </h3>
        </div>

        {/* Fruit Detail Content */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#C5D88F]/60 flex items-center gap-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EFE89F]/40 to-[#C5D88F]/30 shadow-xs border border-[#C5D88F] flex items-center justify-center flex-shrink-0">
            <FruitIllustration fruit={fruitInfo.fruit} size={48} className="drop-shadow-xs" />
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

      {/* 2.5 LE SAVIEZ-VOUS DU JOUR (ROTATION QUOTIDIENNE) */}
      <div className="bg-gradient-to-br from-[#EFE89F]/50 via-[#EFE89F]/25 to-white rounded-3xl p-4 shadow-md border-2 border-[#EFE89F] space-y-2 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-white text-amber-500 flex items-center justify-center shadow-2xs border border-[#EFE89F]">
            <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-300" />
          </div>
          <h3 className="font-serif text-xs font-black text-[#1E4E42]">
            Le saviez-vous ? • Astuce du Jour
          </h3>
        </div>

        <div className="bg-white/95 rounded-2xl p-3.5 border border-[#EFE89F] space-y-1 shadow-2xs">
          <p className="text-xs font-black text-[#D26E7B]">
            {dailyFact?.title || "Le développement sensoriel ✨"}
          </p>
          <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
            {dailyFact?.content || "À ce stade, bébé réagit déjà aux voix de ses parents et aux caresses sur le ventre !"}
          </p>
        </div>
      </div>

      {/* 3. SECTION ACTIVITÉS & JEUX EN FAMILLE (MOCKUP BENTO CUBES) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-serif text-base font-black text-[#1E4E42] leading-tight">
              Activités & jeux en famille
            </h3>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <span>Apprenez, jouez, partagez chaque jour</span>
              <Heart className="w-3 h-3 text-[#D26E7B] fill-[#D26E7B] inline" />
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('predictions')}
            className="text-[11px] font-bold text-[#D26E7B] bg-white hover:bg-rose-50 px-3 py-1 rounded-full border border-rose-200/80 shadow-2xs flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>Voir tout</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 4 Bento Cubes Grid 2x2 */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* CUBE 1 : GRAND PRONO (Coral Pink) */}
          <button
            type="button"
            onClick={() => navigate('predictions')}
            className="bg-gradient-to-br from-[#FA9B9B] to-[#F57B7B] text-white p-4 rounded-[28px] shadow-sm hover:shadow-md active:scale-95 text-left transition-all group flex flex-col justify-between h-[145px] relative overflow-hidden cursor-pointer"
          >
            {/* Top-left Icon in White Circle */}
            <div className="w-11 h-11 rounded-full bg-white/90 shadow-2xs flex items-center justify-center flex-shrink-0">
              <CalendarHeart className="w-5 h-5 text-[#F57B7B]" />
            </div>

            {/* Bottom-right Circle with Arrow */}
            <div className="w-8 h-8 rounded-full bg-white/95 text-[#F57B7B] shadow-2xs flex items-center justify-center absolute bottom-3.5 right-3.5 group-hover:scale-105 transition-all">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            {/* Bottom-left Content */}
            <div className="pr-8">
              <p className="font-serif font-black text-sm text-white leading-tight">Grand Prono</p>
              <p className="text-[10px] text-white/90 font-medium">Paris sur le jour J & prénom</p>
            </div>
          </button>

          {/* CUBE 2 : QUI D'ALIZÉE OU DE LUCAS ? (Soft Sage Green) */}
          <button
            type="button"
            onClick={() => navigate('quiz')}
            className="bg-gradient-to-br from-[#D2E4AD] to-[#B8D389] text-[#26422A] p-4 rounded-[28px] shadow-sm hover:shadow-md active:scale-95 text-left transition-all group flex flex-col justify-between h-[145px] relative overflow-hidden cursor-pointer"
          >
            {/* Top-left Icon in White Circle */}
            <div className="w-11 h-11 rounded-full bg-white/90 shadow-2xs flex items-center justify-center flex-shrink-0">
              <MessageSquareText className="w-5 h-5 text-[#466647]" />
            </div>

            {/* Bottom-right Circle with Arrow */}
            <div className="w-8 h-8 rounded-full bg-white/95 text-[#26422A] shadow-2xs flex items-center justify-center absolute bottom-3.5 right-3.5 group-hover:scale-105 transition-all">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            {/* Bottom-left Content */}
            <div className="pr-8">
              <p className="font-serif font-black text-sm text-[#26422A] leading-tight">Qui d'Alizée<br />ou de Lucas ?</p>
              <p className="text-[10px] text-[#26422A]/85 font-medium">Duel des futurs parents</p>
            </div>
          </button>

          {/* CUBE 3 : MOTS FLÉCHÉS (Periwinkle Blue) */}
          <button
            type="button"
            onClick={() => navigate('games')}
            className="bg-gradient-to-br from-[#A5BBF9] to-[#88A4F3] text-white p-4 rounded-[28px] shadow-sm hover:shadow-md active:scale-95 text-left transition-all group flex flex-col justify-between h-[145px] relative overflow-hidden cursor-pointer"
          >
            {/* Top-left Icon in White Circle */}
            <div className="w-11 h-11 rounded-full bg-white/90 shadow-2xs flex items-center justify-center flex-shrink-0">
              <Puzzle className="w-5 h-5 text-[#6B8CF2]" />
            </div>

            {/* Bottom-right Circle with Arrow */}
            <div className="w-8 h-8 rounded-full bg-white/95 text-[#6B8CF2] shadow-2xs flex items-center justify-center absolute bottom-3.5 right-3.5 group-hover:scale-105 transition-all">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            {/* Bottom-left Content */}
            <div className="pr-8">
              <p className="font-serif font-black text-sm text-white leading-tight">Mots Fléchés</p>
              <p className="text-[10px] text-white/90 font-medium">12 mots & chrono ⏱️</p>
            </div>
          </button>

          {/* CUBE 4 : PETITS DOUTES, GRANDES RÉPONSES (Buttercup Yellow) */}
          <button
            type="button"
            onClick={() => navigate('polls')}
            className="bg-gradient-to-br from-[#FEE79F] to-[#FBD76F] text-[#6B4D1B] p-4 rounded-[28px] shadow-sm hover:shadow-md active:scale-95 text-left transition-all group flex flex-col justify-between h-[145px] relative overflow-hidden cursor-pointer"
          >
            {/* Top-left Icon in White Circle */}
            <div className="w-11 h-11 rounded-full bg-white/90 shadow-2xs flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-300" />
            </div>

            {/* Bottom-right Circle with Arrow */}
            <div className="w-8 h-8 rounded-full bg-white/95 text-[#6B4D1B] shadow-2xs flex items-center justify-center absolute bottom-3.5 right-3.5 group-hover:scale-105 transition-all">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            {/* Bottom-left Content */}
            <div className="pr-8">
              <p className="font-serif font-black text-xs font-black text-[#6B4D1B] leading-tight">Petits Doutes,<br />grandes réponses</p>
              <p className="text-[10px] text-[#6B4D1B]/85 font-medium">On vous aide, à deux</p>
            </div>
          </button>
        </div>

        {/* BANNER 1 : CAPSULE D'AMOUR & MOTS DOUX */}
        <button
          type="button"
          onClick={() => navigate('guestbook')}
          className="w-full bg-[#FEEFF4] border border-[#FCD8E6] rounded-[26px] p-4 flex items-center justify-between shadow-xs relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white shadow-2xs flex items-center justify-center flex-shrink-0 relative border border-pink-100">
              <MailOpen className="w-5 h-5 text-[#F2619C] stroke-[2.2px]" />
              <Heart className="w-2.5 h-2.5 text-[#F2619C] fill-[#F2619C] absolute -top-1 right-2 drop-shadow-2xs animate-pulse" />
            </div>
            <div className="text-left">
              <p className="font-serif font-black text-sm text-[#4A154B] leading-tight">Capsule d'Amour & Mots Doux</p>
              <p className="text-[10px] text-rose-500 font-medium">Écrivez-lui un message plein de tendresse</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white shadow-2xs flex items-center justify-center text-rose-400 flex-shrink-0 group-hover:translate-x-0.5 transition-all">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* BANNER 2 : ESPACE PARENTS */}
        <button
          type="button"
          onClick={() => navigate('parents')}
          className="w-full bg-[#F5F8EE] border border-[#E3EDCE] rounded-[26px] p-4 flex items-center justify-between shadow-xs relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white shadow-2xs flex items-center justify-center flex-shrink-0 relative border border-green-100">
              <ShieldCheck className="w-6 h-6 text-[#466647]" />
            </div>
            <div className="text-left">
              <p className="font-serif font-black text-sm text-[#26422A] flex items-center gap-1.5 leading-tight">
                <span>Espace Parents</span>
                <Lock className="w-3 h-3 text-[#466647]" />
              </p>
              <p className="text-[10px] text-slate-500 font-medium">Votre cocon privé pour tout organiser à deux</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#466647] flex-shrink-0 group-hover:translate-x-0.5 transition-all">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>
    </div>
  );
}
