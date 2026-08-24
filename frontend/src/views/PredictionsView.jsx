import React, { useState, useEffect } from 'react';
import { Target, Sparkles, Trophy, Plus, CheckCircle, Calendar, Clock, Weight, Ruler, Eye, User, Camera, ArrowRight, ChevronDown, MousePointerClick } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser } from '../context/UserContext';
import ParticipantSelector from '../components/ParticipantSelector';

export default function PredictionsView({ isBorn, actualBirth, onOpenAdmin }) {
  const { currentUser } = useUser();
  const [predictions, setPredictions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Form State
  const [author, setAuthor] = useState(currentUser?.name || '');
  const [authorPhoto, setAuthorPhoto] = useState(null);
  const [authorAvatar, setAuthorAvatar] = useState('🦕');
  const [date, setDate] = useState('2026-12-08');
  const [time, setTime] = useState('14:30');
  const [firstName, setFirstName] = useState('');
  const [weight, setWeight] = useState('3.350');
  const [height, setHeight] = useState('50');
  const [eyeColor, setEyeColor] = useState('Bleus / Marrons');
  const [hairColor, setHairColor] = useState('Bruns');
  const [resemblance, setResemblance] = useState('50% Maman, 50% Papa');
  const [message, setMessage] = useState('');

  const fetchPredictions = async () => {
    try {
      const res = await fetch('/api/predictions');
      const data = await res.json();
      if (data.success) {
        setPredictions(data.predictions || []);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  useEffect(() => {
    if (currentUser?.name) {
      setAuthor(currentUser.name);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim()) return;

    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: author.trim(),
          photo: authorPhoto || currentUser?.photo || null,
          avatar: authorAvatar || '🦕',
          date,
          time,
          gender: "boy",
          firstName,
          weight,
          height,
          eyeColor,
          hairColor,
          message
        })
      });
      const data = await res.json();
      if (data.success) {
        setPredictions(data.predictions || []);
        setShowForm(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#facc15', '#4ade80', '#eab308', '#22c55e']
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-5 space-y-5 pb-8">
      {/* Header Banner */}
      <div className="glass-card-sun rounded-3xl p-5 border border-sun-300 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sun-800 bg-white/80 px-2.5 py-0.5 rounded-full border border-sun-200">
              Grand Jeu des Pronostics
            </span>
            <h2 className="font-serif text-xl font-extrabold text-slate-800">
              Les Paris de Naissance
            </h2>
            <p className="text-xs text-amber-800 font-medium">
              Devinez le jour J, le prénom et la bouille du bébé d'Alizée & Lucas !
            </p>
          </div>
          <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-2xl object-cover shadow-2xs border border-[#C5D88F]" />
        </div>
      </div>

      {/* 1. ÉTAPE PRÉLIMINAIRE : SÉLECTION DU JOUEUR AVANT LE PRONOSTIC */}
      {!isBorn && !showForm && (
        <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-[#EFE89F] space-y-4 animate-in zoom-in-95">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#D26E7B]/20 via-[#EFE89F]/40 to-[#C5D88F]/30 border border-[#C5D88F]/50 flex items-center justify-center text-[#D26E7B] shadow-2xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-black text-slate-800">
              Participer au Grand Pronostic
            </h3>
            <p className="text-xs text-amber-800 font-medium">
              Choisis ton profil ci-dessous pour faire tes paris sur le bébé d'Alizée & Lucas !
            </p>
          </div>

          <div className="text-left pt-1">
            <ParticipantSelector
              selectedName={author}
              onSelect={(name, photoOrAvatar) => {
                const isPhoto = photoOrAvatar && (photoOrAvatar.startsWith('data:') || photoOrAvatar.startsWith('http') || photoOrAvatar.startsWith('/'));
                setAuthor(name);
                setAuthorPhoto(isPhoto ? photoOrAvatar : null);
                setAuthorAvatar(!isPhoto ? (photoOrAvatar || '🦕') : '🦕');
              }}
              label="Qui participe au pronostic ?"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (!author.trim()) {
                alert("Merci de sélectionner un participant ou de cliquer sur Créer un joueur !");
                return;
              }
              setShowForm(true);
            }}
            className="w-full bg-gradient-to-r from-[#D26E7B] to-[#be5361] text-white font-bold py-3.5 rounded-2xl shadow-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Commencer mon pronostic</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. FORMULAIRE DE PRONOSTIC (DATE PUIS HEURE L'UNE EN DESSOUS DE L'AUTRE) */}
      {!isBorn && showForm && (
        <form onSubmit={handleSubmit} className="w-full max-w-full bg-white rounded-3xl p-5 shadow-xl border-2 border-[#EFE89F] space-y-4 animate-in fade-in zoom-in-95 overflow-hidden box-border">
          {/* En-tête avec rappel du joueur et bouton Changer */}
          <div className="flex items-center justify-between border-b border-[#EFE89F] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white p-0.5 border-2 border-[#D26E7B] overflow-hidden flex items-center justify-center shadow-2xs">
                {authorPhoto ? (
                  <img src={authorPhoto} alt={author} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-base">{authorAvatar || '🦕'}</span>
                )}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Pronostic de :</p>
                <h4 className="font-serif text-sm font-black text-slate-800 leading-tight">
                  {author}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[11px] font-bold text-slate-400 hover:text-[#D26E7B] bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200 cursor-pointer transition-colors"
            >
              Changer de joueur ✕
            </button>
          </div>

          {/* Date de naissance prévue - Ligne complète même taille que prénom */}
          <div className="space-y-1 min-w-0 w-full">
            <label className="text-[11px] font-bold text-slate-700 block">
              Date de naissance prévue * :
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
              className="w-full max-w-full block box-border min-w-0 px-3 py-2.5 rounded-2xl border-2 border-[#EFE89F] text-xs bg-[#FEFCE7] text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#D26E7B] appearance-none"
            />
          </div>

          {/* Heure estimée - Ligne complète même taille que prénom */}
          <div className="space-y-1 min-w-0 w-full">
            <label className="text-[11px] font-bold text-slate-700 block">
              Heure estimée :
            </label>
            <input
              type="time"
              required
              value={time}
              onChange={e => setTime(e.target.value)}
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
              className="w-full max-w-full block box-border min-w-0 px-3 py-2.5 rounded-2xl border-2 border-[#EFE89F] text-xs bg-[#FEFCE7] text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#D26E7B] appearance-none"
            />
          </div>

          {/* Idée de Prénom */}
          <div className="space-y-1 min-w-0 w-full">
            <label className="text-[11px] font-bold text-slate-700 block">
              Idée de prénom pour le petit prince :
            </label>
            <input
              type="text"
              placeholder="Ex: Jules, Léo, Gabriel, Arthur..."
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
              className="w-full max-w-full block box-border min-w-0 px-3 py-2.5 rounded-2xl border-2 border-[#EFE89F] text-xs font-bold text-slate-800 bg-[#FEFCE7] focus:outline-none focus:ring-2 focus:ring-[#D26E7B] placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>

          {/* Poids & Taille */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 min-w-0">
              <label className="text-[11px] font-bold text-slate-700 block">Poids (kg ou g) :</label>
              <input
                type="text"
                placeholder="Ex: 3.420 ou 3420"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="w-full box-border min-w-0 px-2.5 py-2 rounded-2xl border-2 border-[#EFE89F] text-xs bg-[#FEFCE7] text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
              />
            </div>
            <div className="space-y-1 min-w-0">
              <label className="text-[11px] font-bold text-slate-700 block">Taille (cm) :</label>
              <input
                type="text"
                placeholder="Ex: 50.5"
                value={height}
                onChange={e => setHeight(e.target.value)}
                className="w-full box-border min-w-0 px-2.5 py-2 rounded-2xl border-2 border-[#EFE89F] text-xs bg-[#FEFCE7] text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
              />
            </div>
          </div>

          {/* Cheveux & Yeux */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 min-w-0">
              <label className="text-[11px] font-bold text-slate-700 block">Couleur cheveux :</label>
              <select
                value={hairColor}
                onChange={e => setHairColor(e.target.value)}
                className="w-full box-border min-w-0 px-2.5 py-2 rounded-2xl border-2 border-[#EFE89F] text-xs bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
              >
                <option value="Bruns">Bruns</option>
                <option value="Châtains">Châtains</option>
                <option value="Blonds">Blonds</option>
                <option value="Roux">Roux</option>
                <option value="Duvet fin">Duvet fin / Chauve</option>
              </select>
            </div>
            <div className="space-y-1 min-w-0">
              <label className="text-[11px] font-bold text-slate-700 block">Couleur yeux :</label>
              <select
                value={eyeColor}
                onChange={e => setEyeColor(e.target.value)}
                className="w-full box-border min-w-0 px-2.5 py-2 rounded-2xl border-2 border-[#EFE89F] text-xs bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
              >
                <option value="Marrons">Marrons</option>
                <option value="Bleus">Bleus</option>
                <option value="Verts">Verts</option>
                <option value="Noisette">Noisette</option>
                <option value="Gris">Gris</option>
              </select>
            </div>
          </div>

          {/* Petit mot */}
          <div className="space-y-1 min-w-0">
            <label className="text-[11px] font-bold text-slate-700 block">Un mot doux ou anecdote :</label>
            <textarea
              rows={2}
              placeholder="Ex: Hâte de voir sa petite bouille d'amour !"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full box-border min-w-0 px-3 py-2 rounded-2xl border-2 border-[#EFE89F] text-xs bg-[#FEFCE7] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D26E7B] placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#D26E7B] to-[#be5361] text-white font-bold py-3.5 rounded-2xl shadow-md text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Enregistrer mon pronostic</span>
          </button>
        </form>
      )}

      {/* Predictions Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-serif text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>Tous les pronostics</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {predictions.length} parieurs
          </span>
        </div>

        {/* Phrase d'indication design sur une seule ligne */}
        {predictions.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#C5D88F]/20 rounded-xl border border-[#C5D88F]/40 shadow-2xs">
            <MousePointerClick className="w-3.5 h-3.5 text-[#1E4E42] flex-shrink-0" />
            <span className="text-[11px] text-[#1E4E42] font-medium italic truncate whitespace-nowrap">
              Clique sur un proche pour découvrir son pronostic secret !
            </span>
          </div>
        )}

        {predictions.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-[#EFE89F] space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#D26E7B]/20 via-[#EFE89F]/40 to-[#C5D88F]/30 border border-[#C5D88F]/50 flex items-center justify-center text-[#D26E7B] shadow-2xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-700">Aucun pronostic pour le moment</p>
            <p className="text-[11px] text-slate-400">Sois le tout premier à deviner le jour J !</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {predictions.map((p, idx) => {
              const cardId = p.id || idx;
              const isExpanded = !!expandedIds[cardId];

              return (
                <div
                  key={cardId}
                  className={`bg-white rounded-3xl shadow-sm border transition-all overflow-hidden ${
                    isExpanded ? 'border-[#C5D88F] ring-2 ring-[#C5D88F]/30' : 'border-[#EFE89F] hover:border-[#C5D88F]'
                  }`}
                >
                  {/* Entête cliquable du parieur (Toujours visible) */}
                  <div
                    onClick={() => toggleExpand(cardId)}
                    className="p-3.5 flex items-center justify-between cursor-pointer select-none hover:bg-amber-50/20 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-100 border border-[#EFE89F] flex items-center justify-center text-sm font-bold shadow-2xs flex-shrink-0">
                        {p.photo ? (
                          <img src={p.photo} alt={p.author} className="w-full h-full object-cover" />
                        ) : (
                          <img src="/logo.jpg" alt={p.author} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-800 truncate">{p.author}</p>
                        <p className="text-[10px] text-[#1E4E42] font-medium truncate">
                          Prédit le {p.date ? new Date(p.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''} à {p.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-7 h-7 rounded-xl bg-[#C5D88F]/30 border border-[#C5D88F]/50 flex items-center justify-center text-[#1E4E42] transition-colors">
                        <ChevronDown className={`w-3.5 h-3.5 text-[#1E4E42] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>

                  {/* Bet Details Grid - S'affiche uniquement au clic */}
                  {isExpanded && (
                    <div className="p-3.5 pt-0 border-t border-slate-100 animate-in fade-in-50 duration-200 space-y-2.5">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2.5 text-center">
                        {/* Poids */}
                        <div className="bg-[#FEFCE7] rounded-xl p-2 border border-[#EFE89F] shadow-2xs">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold flex items-center justify-center gap-1">
                            <span>Poids</span>
                          </p>
                          <p className="text-xs font-black text-[#1E4E42] mt-0.5">{p.weight ? (p.weight > 100 ? `${p.weight} g` : `${p.weight} kg`) : `${p.weightG || 3350} g`}</p>
                        </div>

                        {/* Taille */}
                        <div className="bg-[#ECCEE6]/25 rounded-xl p-2 border border-[#ECCEE6] shadow-2xs">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold flex items-center justify-center gap-1">
                            <span>Taille</span>
                          </p>
                          <p className="text-xs font-black text-[#1E4E42] mt-0.5">{p.height || p.sizeCm || 50} cm</p>
                        </div>

                        {/* Prénom */}
                        {p.firstName && (
                          <div className="bg-[#92AFEC]/20 rounded-xl p-2 border border-[#92AFEC]/50 shadow-2xs col-span-2 sm:col-span-1">
                            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold flex items-center justify-center gap-1">
                              <span>Prénom</span>
                            </p>
                            <p className="text-xs font-black text-[#D26E7B] truncate mt-0.5">{p.firstName}</p>
                          </div>
                        )}

                        {/* Yeux */}
                        <div className="bg-[#FEFCE7] rounded-xl p-2 border border-[#EFE89F] shadow-2xs">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold flex items-center justify-center gap-1">
                            <span>Yeux</span>
                          </p>
                          <p className="text-xs font-black text-[#1E4E42] mt-0.5">{p.eyeColor || 'Bleus'}</p>
                        </div>

                        {/* Cheveux */}
                        <div className="bg-[#D26E7B]/10 rounded-xl p-2 border border-[#D26E7B]/30 shadow-2xs">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold flex items-center justify-center gap-1">
                            <span>Cheveux</span>
                          </p>
                          <p className="text-xs font-black text-[#1E4E42] mt-0.5">{p.hairColor || 'Bruns'}</p>
                        </div>

                        {/* Date & Heure */}
                        <div className="bg-[#C5D88F]/25 rounded-xl p-2 border border-[#C5D88F]/60 shadow-2xs col-span-2 sm:col-span-1">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold flex items-center justify-center gap-1">
                            <span>Jour J</span>
                          </p>
                          <p className="text-xs font-black text-[#1E4E42] truncate mt-0.5">
                            {p.date ? new Date(p.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''} à {p.time}
                          </p>
                        </div>
                      </div>

                      {p.message && (
                        <p className="text-xs text-slate-600 bg-amber-50/30 p-2.5 rounded-xl border border-sun-100/60 italic">
                          « {p.message} »
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
