import React, { useState, useEffect } from 'react';
import { Lock, Baby, ShoppingBag, Briefcase, Calendar, Plus, CheckCircle2, Trash2, Camera, Sparkles, PlusCircle, X, Tag, ChevronLeft, ChevronRight, Clock, MapPin, AlertCircle, Key, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { compressImage } from '../utils/imageCompressor';

export default function ParentsSpaceView({ isBorn, actualBirth, onBirthSaved, onResetBirth }) {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('parents_auth_alizee') === 'true');
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('birth'); // 'birth', 'purchases', 'bag', 'appointments', 'code'
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const code = inputCode.trim();
    if (code === '1234') {
      setIsAuthenticated(true);
      localStorage.setItem('parents_auth_alizee', 'true');
      setErrorMsg('');
      confetti({ particleCount: 50, spread: 60, colors: ['#facc15', '#4ade80', '#38bdf8'] });
      return;
    }
    try {
      const res = await fetch('/api/config/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: code })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('parents_auth_alizee', 'true');
        setErrorMsg('');
        confetti({ particleCount: 50, spread: 60, colors: ['#facc15', '#4ade80', '#38bdf8'] });
      } else {
        setErrorMsg("Code secret incorrect.");
      }
    } catch (err) {
      setErrorMsg("Code secret incorrect.");
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('parents_auth_alizee');
    setInputCode('');
  };

  // Birth Announcement Form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [firstName, setFirstName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [eyeColor, setEyeColor] = useState('Bleus');
  const [hairColor, setHairColor] = useState('Bruns');
  const [resemblance, setResemblance] = useState('50% Alizée, 50% Lucas');
  const [photo, setPhoto] = useState(null);

  // PURCHASES (With dynamic categories)
  const [purchases, setPurchases] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [newPurchaseTitle, setNewPurchaseTitle] = useState('');
  const [newPurchaseCategory, setNewPurchaseCategory] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // MATERNITY BAG (Alizée, Lucas, Bébé)
  const [maternityBag, setMaternityBag] = useState([]);
  const [inlineNewBaby, setInlineNewBaby] = useState('');
  const [inlineNewAlizee, setInlineNewAlizee] = useState('');
  const [inlineNewLucas, setInlineNewLucas] = useState('');

  // Security / PIN Change State
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');

  // APPOINTMENTS & CALENDAR
  const [appointments, setAppointments] = useState([]);
  const [newRdvTitle, setNewRdvTitle] = useState('');
  const [newRdvDate, setNewRdvDate] = useState(new Date().toISOString().split('T')[0]);
  const [newRdvTime, setNewRdvTime] = useState('10:00');
  const [newRdvLocation, setNewRdvLocation] = useState('');
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);

  const fetchPurchases = async () => {
    try {
      const res = await fetch('/api/purchases');
      const data = await res.json();
      if (data.success) {
        setPurchases(data.items || []);
        setCategories(data.categories || []);
        if (!newPurchaseCategory && data.categories?.length > 0) {
          setNewPurchaseCategory(data.categories[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMaternityBag = async () => {
    try {
      const res = await fetch('/api/maternity-bag');
      const data = await res.json();
      if (data.success) setMaternityBag(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (data.success) setAppointments(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchMaternityBag();
    fetchAppointments();
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 500, 500, 0.85);
        setPhoto(compressed);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveBirth = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !weight || !height) return;

    try {
      const res = await fetch('/api/predictions/birth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          time,
          firstName: firstName.trim(),
          weight,
          height,
          eyeColor,
          hairColor,
          resemblance,
          photo
        })
      });
      const data = await res.json();
      if (data.success) {
        if (onBirthSaved) onBirthSaved(data.actualBirth);
        confetti({ particleCount: 150, spread: 90, colors: ['#facc15', '#4ade80', '#22c55e'] });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- PURCHASES ACTIONS ---
  const handleAddPurchase = async (e) => {
    e.preventDefault();
    if (!newPurchaseTitle.trim()) return;
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPurchaseTitle.trim(),
          category: newPurchaseCategory || (categories[0] || "Indispensables 🌟")
        })
      });
      const data = await res.json();
      if (data.success) {
        setPurchases(data.items);
        setCategories(data.categories);
        setNewPurchaseTitle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePurchase = async (id) => {
    try {
      const res = await fetch(`/api/purchases/${id}/toggle`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) setPurchases(data.items);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePurchase = async (id) => {
    try {
      const res = await fetch(`/api/purchases/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setPurchases(data.items);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch('/api/purchases/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategoryName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        setNewPurchaseCategory(newCategoryName.trim());
        setNewCategoryName('');
        setShowAddCategoryModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (catName) => {
    if (!window.confirm(`Supprimer la catégorie "${catName}" ?`)) return;
    try {
      const res = await fetch(`/api/purchases/categories/${encodeURIComponent(catName)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        if (selectedCategoryFilter === catName) setSelectedCategoryFilter('all');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- MATERNITY BAG ACTIONS (Alizée, Lucas, Bébé) ---
  const handleAddPersonItem = async (e, forWho, text, setText) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await fetch('/api/maternity-bag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text.trim(), forWho })
      });
      const data = await res.json();
      if (data.success) {
        setMaternityBag(data.items);
        setText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBagItem = async (id) => {
    try {
      const res = await fetch(`/api/maternity-bag/${id}/toggle`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) setMaternityBag(data.items);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBagItem = async (id) => {
    try {
      const res = await fetch(`/api/maternity-bag/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setMaternityBag(data.items);
    } catch (err) {
      console.error(err);
    }
  };

  // --- PIN CHANGE ACTION ---
  const handleChangePin = async (e) => {
    e.preventDefault();
    setPinChangeSuccess('');
    setPinChangeError('');

    if (newPinInput.length < 4) {
      setPinChangeError("Le nouveau code doit contenir au moins 4 chiffres.");
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinChangeError("Les nouveaux codes ne correspondent pas.");
      return;
    }

    try {
      const res = await fetch('/api/config/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPin: oldPinInput.trim(),
          newPin: newPinInput.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setPinChangeSuccess("Votre code secret a été mis à jour avec succès ! ✨");
        setOldPinInput('');
        setNewPinInput('');
        setConfirmPinInput('');
        confetti({ particleCount: 50, spread: 60 });
      } else {
        setPinChangeError(data.error || "Code actuel incorrect.");
      }
    } catch (err) {
      setPinChangeError("Erreur lors de la modification.");
    }
  };

  // --- APPOINTMENTS ACTIONS ---
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!newRdvTitle.trim()) return;
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newRdvTitle.trim(), date: newRdvDate, time: newRdvTime, location: newRdvLocation.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.items);
        setNewRdvTitle('');
        setNewRdvLocation('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setAppointments(data.items);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered lists
  const filteredPurchases = purchases.filter(item => {
    if (selectedCategoryFilter === 'all') return true;
    return item.category === selectedCategoryFilter;
  });

  const babyItems = maternityBag.filter(i => i.forWho === 'baby' || i.forWho === 'bébé' || i.category?.toLowerCase().includes('bébé') || (!i.forWho && !i.category));
  const alizeeItems = maternityBag.filter(i => i.forWho === 'alizee' || i.forWho === 'maman' || i.category?.toLowerCase().includes('maman') || i.category?.toLowerCase().includes('alizée'));
  const lucasItems = maternityBag.filter(i => i.forWho === 'lucas' || i.forWho === 'papa' || i.category?.toLowerCase().includes('papa') || i.category?.toLowerCase().includes('lucas'));

  const bagTotal = maternityBag.length;
  const bagDoneTotal = maternityBag.filter(i => i.completed).length;
  const bagPercent = bagTotal > 0 ? Math.round((bagDoneTotal / bagTotal) * 100) : 0;

  if (!isAuthenticated) {
    return (
      <div className="px-5 space-y-5 pb-8 animate-in zoom-in-95">
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-sun-300 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 border-2 border-sun-300 flex items-center justify-center mx-auto text-3xl shadow-inner">
            🔒
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-lg font-black text-slate-800">
              Espace Privé des Parents
            </h3>
            <p className="text-xs text-amber-800 font-medium">
              Alizée & Lucas • Entrez votre code secret pour accéder à la valise de maternité, listes et annonce !
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 pt-2">
            <div className="relative max-w-[200px] mx-auto">
              <input
                type="password"
                maxLength={8}
                value={inputCode}
                onChange={(e) => { setInputCode(e.target.value); setErrorMsg(''); }}
                placeholder="Code"
                autoFocus
                className="w-full text-center text-xl font-mono tracking-widest py-3 px-4 rounded-2xl border-2 border-[#EFE89F] bg-amber-50/50 text-slate-800 focus:outline-none focus:ring-4 focus:ring-[#EFE89F] focus:border-[#D26E7B] font-bold"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-bold text-red-500">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full max-w-[200px] mx-auto bg-gradient-to-r from-[#D26E7B] to-[#be5361] text-white font-bold py-3 rounded-2xl shadow-md text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Déverrouiller</span>
            </button>
          </form>

          <p className="text-[11px] text-slate-400 font-medium pt-1">
            Espace réservé aux futurs parents 💖
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 space-y-5 pb-8">
      {/* Header Banner */}
      <div className="glass-card-sun rounded-3xl p-5 border border-sun-300 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-mint-100 px-2.5 py-0.5 rounded-full border border-mint-300">
              Espace Privé d'Alizée & Lucas
            </span>
            <h2 className="font-serif text-xl font-extrabold text-slate-800">
              Organisation & Valise
            </h2>
            <p className="text-xs text-amber-900 font-medium">
              Gérez les listes, la valise de maternité et l'annonce de naissance !
            </p>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleLock}
              className="text-[10px] font-bold text-slate-500 hover:text-red-600 bg-white/80 px-2.5 py-1 rounded-full border border-sun-200 shadow-2xs flex items-center gap-1 cursor-pointer"
              title="Verrouiller l'espace parents"
            >
              <Lock className="w-3 h-3" />
              <span>Verrouiller</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-5 gap-1 bg-amber-100/60 p-1.5 rounded-2xl border border-sun-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('birth')}
          className={`py-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
            activeTab === 'birth' ? 'bg-white text-sun-800 shadow-xs scale-102 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Baby className="w-4 h-4 text-[#D26E7B]" />
          <span className="text-[10px]">Jour J</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('purchases')}
          className={`py-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
            activeTab === 'purchases' ? 'bg-white text-sun-800 shadow-xs scale-102 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#D26E7B]" />
          <span className="text-[10px]">Achats</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bag')}
          className={`py-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
            activeTab === 'bag' ? 'bg-white text-sun-800 shadow-xs scale-102 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4 text-[#D26E7B]" />
          <span className="text-[10px]">Valise</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={`py-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
            activeTab === 'appointments' ? 'bg-white text-sun-800 shadow-xs scale-102 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#D26E7B]" />
          <span className="text-[10px]">RDV</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={`py-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
            activeTab === 'code' ? 'bg-white text-sun-800 shadow-xs scale-102 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Key className="w-4 h-4 text-[#D26E7B]" />
          <span className="text-[10px]">Code</span>
        </button>
      </div>

      {/* 1. TAB: NAISSANCE OFFICIELLE */}
      {activeTab === 'birth' && (
        <div className="space-y-4">
          {isBorn && actualBirth ? (
            <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-sun-300 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-[#D26E7B]/20 via-[#EFE89F]/40 to-[#C5D88F]/30 border border-[#C5D88F]/50 flex items-center justify-center text-[#D26E7B] shadow-2xs">
                <Baby className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-black text-slate-800">
                  Notre Petit Prince est Arrivé !
                </h3>
                <p className="text-xs text-sun-700 font-bold">
                  Bienvenue au trésor d'Alizée & Lucas
                </p>
              </div>

              {actualBirth.photo && (
                <div className="w-36 h-36 mx-auto rounded-3xl overflow-hidden shadow-md border-2 border-sun-300">
                  <img src={actualBirth.photo} alt="Bébé" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 text-left bg-amber-50/50 p-4 rounded-2xl border border-sun-200">
                <p>Prénom : <strong>{actualBirth.firstName}</strong></p>
                <p>Né le : <strong>{actualBirth.date}</strong></p>
                <p>Poids : <strong>{actualBirth.weight} kg</strong></p>
                <p>Taille : <strong>{actualBirth.height} cm</strong></p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (window.confirm("Réinitialiser l'état de naissance ?")) {
                    await fetch('/api/predictions/reset', { method: 'POST' });
                    if (onResetBirth) onResetBirth();
                  }
                }}
                className="text-xs text-red-500 underline font-bold cursor-pointer"
              >
                Réinitialiser la naissance
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveBirth} className="bg-white rounded-3xl p-5 shadow-sm border border-sun-200 space-y-3.5">
              <div className="border-b border-sun-100 pb-2">
                <h3 className="font-serif text-sm font-bold text-slate-800">
                  Annoncer la Naissance Officielle
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ces informations départageront le grand gagnant des pronostics !
                </p>
              </div>

              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-24 h-24 rounded-3xl bg-amber-50 border-2 border-dashed border-sun-300 flex items-center justify-center overflow-hidden relative group cursor-pointer shadow-inner">
                  {photo ? (
                    <img src={photo} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-sun-400" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Ajouter la première photo</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 block">Prénom officiel :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Léo, Gabriel, Raphaël..."
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sun-200 text-xs bg-amber-50/20 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Date de naissance :</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-sun-200 text-xs bg-white text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Heure exacte :</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-sun-200 text-xs bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Poids (kg) :</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 3.45"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-sun-200 text-xs bg-white text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Taille (cm) :</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="Ex: 50.5"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-sun-200 text-xs bg-white text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D26E7B] to-[#be5361] text-white font-bold py-3 rounded-2xl shadow-md text-xs transition-all active:scale-95 cursor-pointer mt-2"
              >
                Publier l'Annonce Officielle
              </button>
            </form>
          )}
        </div>
      )}

      {/* 2. TAB: LISTE D'ACHATS AVEC CATÉGORIES DYNAMIQUES */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Filtrer par catégorie</span>
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(true)}
                className="text-[10px] font-bold text-[#D26E7B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Nouvelle catégorie</span>
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-sun-500 text-white border-sun-600 shadow-xs font-extrabold'
                    : 'bg-white text-slate-700 border-sun-200 hover:bg-sun-50'
                }`}
              >
                Tous ({purchases.length})
              </button>

              {categories.map(cat => {
                const count = purchases.filter(p => p.category === cat).length;
                const isSelected = selectedCategoryFilter === cat;
                return (
                  <div
                    key={cat}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-sun-500 text-white border-sun-600 shadow-xs font-extrabold'
                        : 'bg-white text-slate-700 border-sun-200 hover:bg-sun-50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className="cursor-pointer"
                    >
                      {cat} ({count})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      className={`p-0.5 rounded-full hover:bg-black/10 transition-colors ${
                        isSelected ? 'text-white/80 hover:text-white' : 'text-slate-300 hover:text-red-500'
                      }`}
                      title="Supprimer cette catégorie"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Category Modal */}
          {showAddCategoryModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
              <form onSubmit={handleAddCategory} className="bg-white rounded-3xl p-5 shadow-2xl border-2 border-sun-300 max-w-xs w-full space-y-3 animate-in zoom-in-95">
                <div className="flex justify-between items-center border-b border-sun-100 pb-2">
                  <h4 className="font-serif text-sm font-bold text-slate-800">Ajouter une Catégorie</h4>
                  <button type="button" onClick={() => setShowAddCategoryModal(false)} className="text-slate-400 cursor-pointer">✕</button>
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Ex: Décoration, Sécurité..."
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-sun-200 text-xs bg-amber-50/20 font-bold"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow transition-colors cursor-pointer"
                >
                  Créer la catégorie
                </button>
              </form>
            </div>
          )}

          {/* Add Purchase Form */}
          <form onSubmit={handleAddPurchase} className="bg-white p-3.5 rounded-2xl border border-sun-200 shadow-xs space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Nouvel achat à prévoir..."
                value={newPurchaseTitle}
                onChange={e => setNewPurchaseTitle(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-sun-200 text-xs bg-amber-50/20"
              />
              <select
                value={newPurchaseCategory}
                onChange={e => setNewPurchaseCategory(e.target.value)}
                className="px-2 py-2 rounded-xl border border-sun-200 text-xs bg-white font-bold text-slate-700 max-w-[130px]"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-sun-500 hover:bg-sun-600 text-white py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter à la liste d'achats</span>
            </button>
          </form>

          {/* Purchases List */}
          <div className="space-y-2">
            {filteredPurchases.length === 0 ? (
              <div className="bg-white rounded-2xl p-5 text-center border border-sun-200 text-xs text-slate-400">
                Aucun achat dans cette catégorie pour le moment.
              </div>
            ) : (
              filteredPurchases.map(item => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-2xl border border-sun-100 flex items-center justify-between shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => handleTogglePurchase(item.id)}
                    className="flex items-center gap-2.5 text-xs text-left cursor-pointer flex-1"
                  >
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                      item.completed ? 'bg-mint-500 border-mint-600 text-white' : 'border-slate-300'
                    }`}>
                      {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={item.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-bold'}>
                      {item.title}
                    </span>
                  </button>
                  <span className="text-[9px] bg-amber-50 text-sun-800 font-bold px-2 py-0.5 rounded-full border border-sun-200 mr-2 max-w-[100px] truncate">
                    {item.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeletePurchase(item.id)}
                    className="text-slate-300 hover:text-red-500 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. TAB: VALISE MATERNITÉ (AVEC JAUGE DE PROGRESSION GLOBALE ET 3 SECTIONS ÉPURÉES) */}
      {activeTab === 'bag' && (
        <div className="space-y-4">
          {/* Jauge globale de progression en haut */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#EFE89F] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Préparation Valise de Maternité
                </span>
                <h3 className="font-serif text-base font-bold text-slate-800">
                  {bagDoneTotal} sur {bagTotal} articles prêts
                </h3>
              </div>
              <span className="text-base font-black text-[#D26E7B] bg-[#D26E7B]/10 px-3 py-1 rounded-2xl border border-[#D26E7B]/20">
                {bagPercent}%
              </span>
            </div>

            <div className="w-full h-3 bg-amber-50 rounded-full overflow-hidden p-0.5 border border-[#EFE89F] shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#D26E7B] via-[#EFE89F] to-[#C5D88F] rounded-full transition-all duration-500"
                style={{ width: `${bagPercent}%` }}
              />
            </div>
          </div>

          {/* Section 1 : Pour Bébé */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#EFE89F] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-mint-50 flex items-center justify-center text-emerald-700">
                  <Baby className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-sm font-black text-slate-800">Pour Bébé</h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-mint-50 px-2 py-0.5 rounded-full border border-mint-200">
                {babyItems.filter(i => i.completed).length}/{babyItems.length} prêts
              </span>
            </div>

            <div className="space-y-1.5">
              {babyItems.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">Aucun article pour bébé pour le moment.</p>
              ) : (
                babyItems.map(item => (
                  <div key={item.id} className="p-2.5 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => handleToggleBagItem(item.id)}
                      className="flex items-center gap-2 text-xs text-left cursor-pointer flex-1"
                    >
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        item.completed ? 'bg-mint-500 border-mint-600 text-white' : 'border-slate-300'
                      }`}>
                        {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className={item.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-bold'}>
                        {item.title}
                      </span>
                    </button>
                    <button type="button" onClick={() => handleDeleteBagItem(item.id)} className="text-slate-300 hover:text-red-500 p-1 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Inline Add Bébé */}
            <form onSubmit={(e) => handleAddPersonItem(e, 'baby', inlineNewBaby, setInlineNewBaby)} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Ajouter un article pour bébé..."
                value={inlineNewBaby}
                onChange={e => setInlineNewBaby(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-[#EFE89F] text-xs bg-[#FEFCE7] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-[#D26E7B] text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
                title="Ajouter"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
              </button>
            </form>
          </div>

          {/* Section 2 : Pour Alizée */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#EFE89F] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-[#D26E7B]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-sm font-black text-slate-800">Pour Alizée</h4>
              </div>
              <span className="text-[10px] font-bold text-[#D26E7B] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                {alizeeItems.filter(i => i.completed).length}/{alizeeItems.length} prêts
              </span>
            </div>

            <div className="space-y-1.5">
              {alizeeItems.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">Aucun article pour Alizée pour le moment.</p>
              ) : (
                alizeeItems.map(item => (
                  <div key={item.id} className="p-2.5 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => handleToggleBagItem(item.id)}
                      className="flex items-center gap-2 text-xs text-left cursor-pointer flex-1"
                    >
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        item.completed ? 'bg-mint-500 border-mint-600 text-white' : 'border-slate-300'
                      }`}>
                        {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className={item.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-bold'}>
                        {item.title}
                      </span>
                    </button>
                    <button type="button" onClick={() => handleDeleteBagItem(item.id)} className="text-slate-300 hover:text-red-500 p-1 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Inline Add Alizée */}
            <form onSubmit={(e) => handleAddPersonItem(e, 'alizee', inlineNewAlizee, setInlineNewAlizee)} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Ajouter un article pour Alizée..."
                value={inlineNewAlizee}
                onChange={e => setInlineNewAlizee(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-[#EFE89F] text-xs bg-[#FEFCE7] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-[#D26E7B] text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
                title="Ajouter"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
              </button>
            </form>
          </div>

          {/* Section 3 : Pour Lucas */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#EFE89F] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-sm font-black text-slate-800">Pour Lucas</h4>
              </div>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {lucasItems.filter(i => i.completed).length}/{lucasItems.length} prêts
              </span>
            </div>

            <div className="space-y-1.5">
              {lucasItems.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">Aucun article pour Lucas pour le moment.</p>
              ) : (
                lucasItems.map(item => (
                  <div key={item.id} className="p-2.5 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => handleToggleBagItem(item.id)}
                      className="flex items-center gap-2 text-xs text-left cursor-pointer flex-1"
                    >
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        item.completed ? 'bg-mint-500 border-mint-600 text-white' : 'border-slate-300'
                      }`}>
                        {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className={item.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-bold'}>
                        {item.title}
                      </span>
                    </button>
                    <button type="button" onClick={() => handleDeleteBagItem(item.id)} className="text-slate-300 hover:text-red-500 p-1 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Inline Add Lucas */}
            <form onSubmit={(e) => handleAddPersonItem(e, 'lucas', inlineNewLucas, setInlineNewLucas)} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Ajouter un article pour Lucas..."
                value={inlineNewLucas}
                onChange={e => setInlineNewLucas(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-[#EFE89F] text-xs bg-[#FEFCE7] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-[#D26E7B] text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
                title="Ajouter"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. TAB: RENDEZ-VOUS & CALENDRIER MENSUEL */}
      {activeTab === 'appointments' && (() => {
        const year = currentMonthDate.getFullYear();
        const month = currentMonthDate.getMonth();
        const monthName = currentMonthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const prevMonth = () => setCurrentMonthDate(new Date(year, month - 1, 1));
        const nextMonth = () => setCurrentMonthDate(new Date(year, month + 1, 1));
        const jumpToTerm = () => {
          setCurrentMonthDate(new Date(2026, 11, 1));
          setSelectedCalendarDay('2026-12-08');
          setNewRdvDate('2026-12-08');
        };

        const filteredAppointments = selectedCalendarDay
          ? appointments.filter(a => a.date === selectedCalendarDay)
          : appointments;

        return (
          <div className="space-y-4 animate-in fade-in">
            {/* 1. MINI CALENDRIER MENSUEL DESIGN & INTUITIF */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-[#EFE89F] space-y-3">
              {/* Navigation Mois & Année */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-[#D26E7B] border border-[#EFE89F]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-black text-[#1E4E42] capitalize leading-tight">
                      {monthName}
                    </h4>
                    <p className="text-[10px] text-slate-400">Cliquez sur un jour pour voir ou ajouter un RDV</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer"
                    title="Mois précédent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={jumpToTerm}
                    className="text-[10px] font-black px-2.5 py-1 bg-[#ECCEE6] text-[#D26E7B] rounded-xl border border-[#D26E7B]/30 hover:bg-[#ECCEE6]/80 cursor-pointer shadow-2xs"
                    title="Aller au jour du terme (08 Décembre 2026)"
                  >
                    Terme (08/12)
                  </button>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer"
                    title="Mois suivant"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Grille des 7 jours de la semaine */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 border-b border-slate-100 pb-1.5">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mer</span>
                <span>Jeu</span>
                <span>Ven</span>
                <span>Sam</span>
                <span>Dim</span>
              </div>

              {/* Grille des jours du mois */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Cases vides pour le début du mois */}
                {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-9" />
                ))}

                {/* Jours du mois */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const dayRdvs = appointments.filter(a => a.date === dateStr);
                  const hasRdv = dayRdvs.length > 0;
                  const isTerm = dateStr === '2026-12-08';
                  const isSelected = selectedCalendarDay === dateStr;

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedCalendarDay(null);
                        } else {
                          setSelectedCalendarDay(dateStr);
                          setNewRdvDate(dateStr);
                        }
                      }}
                      className={`h-9 rounded-2xl flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D26E7B] text-white font-black shadow-md scale-105 ring-2 ring-[#D26E7B]/40'
                          : isTerm
                          ? 'bg-[#ECCEE6] text-[#D26E7B] font-black border-2 border-[#D26E7B] shadow-2xs'
                          : hasRdv
                          ? 'bg-[#FEFCE7] text-[#1E4E42] font-black border border-[#EFE89F] shadow-2xs'
                          : 'hover:bg-slate-100 text-slate-700 font-bold'
                      }`}
                    >
                      <span className="text-xs leading-none">{dayNum}</span>

                      {/* Marqueur visuel sous le chiffre */}
                      {isTerm && !isSelected ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D26E7B] mt-0.5" />
                      ) : hasRdv && !isSelected ? (
                        <div className="flex gap-0.5 mt-0.5">
                          {dayRdvs.slice(0, 2).map((_, rIdx) => (
                            <span key={rIdx} className="w-1 h-1 rounded-full bg-[#D26E7B]" />
                          ))}
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Légende du calendrier */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 px-1 border-t border-slate-100 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D26E7B]" />
                  <span>RDV Prévu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ECCEE6] border border-[#D26E7B]" />
                  <span>Terme (08/12)</span>
                </div>
                {selectedCalendarDay && (
                  <button
                    type="button"
                    onClick={() => setSelectedCalendarDay(null)}
                    className="text-[#D26E7B] font-black hover:underline cursor-pointer"
                  >
                    ✕ Tout afficher
                  </button>
                )}
              </div>
            </div>

            {/* 2. FORMULAIRE AJOUT RDV (DATE ET HEURE L'UNE EN DESSOUS DE L'AUTRE SANS DÉBORDEMENT) */}
            <form onSubmit={handleAddAppointment} className="bg-white p-4 rounded-3xl border-2 border-[#EFE89F] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#1E4E42] flex items-center gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5 text-[#D26E7B]" />
                  <span>Ajouter un Rendez-Vous</span>
                </h4>
                {selectedCalendarDay && (
                  <span className="text-[10px] font-bold text-[#D26E7B] bg-[#D26E7B]/10 px-2 py-0.5 rounded-full">
                    Pour le {new Date(selectedCalendarDay).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>

              <input
                type="text"
                required
                placeholder="Titre du rendez-vous (ex: Échographie T3, Consultation 8ème mois...)"
                value={newRdvTitle}
                onChange={e => setNewRdvTitle(e.target.value)}
                className="w-full box-border min-w-0 px-3 py-2 rounded-xl border border-[#EFE89F] text-xs bg-[#FEFCE7] text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
              />

              <div className="space-y-2">
                <div className="space-y-0.5">
                  <label className="text-[10px] font-bold text-slate-600 block">Date :</label>
                  <input
                    type="date"
                    required
                    value={newRdvDate}
                    onChange={e => setNewRdvDate(e.target.value)}
                    className="w-full box-border min-w-0 px-3 py-2 rounded-xl border border-[#EFE89F] text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[10px] font-bold text-slate-600 block">Heure :</label>
                  <input
                    type="time"
                    value={newRdvTime}
                    onChange={e => setNewRdvTime(e.target.value)}
                    className="w-full box-border min-w-0 px-3 py-2 rounded-xl border border-[#EFE89F] text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
                  />
                </div>
              </div>

              <input
                type="text"
                placeholder="Lieu / Praticien (ex: Maternité, Cabinet Dr. Sophie...)"
                value={newRdvLocation}
                onChange={e => setNewRdvLocation(e.target.value)}
                className="w-full box-border min-w-0 px-3 py-2 rounded-xl border border-[#EFE89F] text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D26E7B] to-[#be5361] text-white py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enregistrer dans le calendrier</span>
              </button>
            </form>

            {/* 3. LISTE DES RENDEZ-VOUS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-black text-slate-800">
                  {selectedCalendarDay
                    ? `Rendez-vous du ${new Date(selectedCalendarDay).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
                    : `Tous les Rendez-Vous Prévus (${appointments.length})`}
                </h4>
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl p-5 text-center border border-[#EFE89F] text-xs text-slate-400 space-y-1">
                  <p>Aucun rendez-vous {selectedCalendarDay ? 'ce jour-là' : 'enregistré'}.</p>
                  <p className="text-[10px] text-slate-400">Utilise le formulaire ci-dessus pour planifier vos consultations.</p>
                </div>
              ) : (
                filteredAppointments.map(rdv => (
                  <div
                    key={rdv.id}
                    className="bg-white p-3.5 rounded-2xl border border-[#EFE89F] flex items-center justify-between shadow-2xs hover:shadow-xs transition-all"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#FEFCE7] border border-[#EFE89F] flex items-center justify-center text-[#D26E7B] flex-shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{rdv.title}</p>
                        <p className="text-[10px] text-[#D26E7B] font-bold mt-0.5">
                          {rdv.date ? new Date(rdv.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''} {rdv.time ? `à ${rdv.time}` : ''}
                        </p>
                        {rdv.location && (
                          <p className="text-[10px] text-slate-500 font-medium">
                            {rdv.location}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAppointment(rdv.id)}
                      className="text-slate-300 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                      title="Supprimer ce rendez-vous"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })()}

      {/* 5. TAB: CODE DE SÉCURITÉ PARENTS */}
      {activeTab === 'code' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#EFE89F] space-y-4 animate-in fade-in">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-[#D26E7B]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-slate-800">
                Code Secret Parents
              </h3>
              <p className="text-xs text-slate-400">
                Modifiez votre code d'accès privé (par défaut : 1234)
              </p>
            </div>
          </div>

          {pinChangeSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{pinChangeSuccess}</span>
            </div>
          )}

          {pinChangeError && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-2xl border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>{pinChangeError}</span>
            </div>
          )}

          <form onSubmit={handleChangePin} className="space-y-3 max-w-sm">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Code actuel :</label>
              <input
                type="password"
                required
                value={oldPinInput}
                onChange={e => setOldPinInput(e.target.value)}
                placeholder="••••"
                className="w-full px-3 py-2 rounded-xl border border-[#EFE89F] bg-[#FEFCE7] text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Nouveau code secret :</label>
              <input
                type="password"
                required
                value={newPinInput}
                onChange={e => setNewPinInput(e.target.value)}
                placeholder="4 chiffres minimum"
                className="w-full px-3 py-2 rounded-xl border border-[#EFE89F] bg-white text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Confirmer le nouveau code :</label>
              <input
                type="password"
                required
                value={confirmPinInput}
                onChange={e => setConfirmPinInput(e.target.value)}
                placeholder="••••"
                className="w-full px-3 py-2 rounded-xl border border-[#EFE89F] bg-white text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#D26E7B]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D26E7B] to-[#be5361] text-white font-bold py-3 rounded-2xl shadow-md text-xs transition-all cursor-pointer active:scale-95 mt-2"
            >
              Enregistrer le nouveau code
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
