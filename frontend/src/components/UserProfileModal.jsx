import React, { useState } from 'react';
import { Camera, User, X, Sparkles, Check, Smile, PlusCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { compressImage } from '../utils/imageCompressor';

export default function UserProfileModal({ isOpen, onClose, required = false }) {
  const { currentUser, participants, registerUser, selectExistingUser } = useUser();
  const [pseudo, setPseudo] = useState(currentUser?.name || '');
  const [photo, setPhoto] = useState(currentUser?.photo || null);
  const [avatar, setAvatar] = useState(currentUser?.avatar || '🦁');
  const [role, setRole] = useState(currentUser?.role || 'Proche');
  const [showAddForm, setShowAddForm] = useState(!currentUser && participants.length === 0);

  if (!isOpen) return null;

  const defaultAvatars = ['🦕', '🦖', '👑', '🦁', '🐻', '🚀', '🦊', '⭐', '🍼', '⚽'];
  const defaultRoles = ['Tata', 'Tonton', 'Mamie', 'Papi', 'Marraine', 'Parrain', 'Cousin(e)', 'Ami(e)', 'Maman', 'Papa'];

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 400, 400, 0.85);
        setPhoto(compressed);
      } catch (err) {
        console.error("Erreur compression photo:", err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!pseudo.trim()) return;
    await registerUser({
      name: pseudo.trim(),
      photo,
      avatar,
      role
    });
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-sun-200 relative max-h-[90vh] overflow-y-auto space-y-4">
        {!required && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-mint-400 to-emerald-500 text-white flex items-center justify-center mx-auto text-2xl shadow-md border border-mint-300">
            🦕
          </div>
          <h3 className="font-serif text-lg font-black text-slate-800">
            Qui es-tu ? 💛
          </h3>
          <p className="text-xs text-sun-700 font-medium">
            Enregistre-toi une seule fois pour jouer aux jeux, voter et faire tes pronos !
          </p>
        </div>

        {/* Option 1: Choose from existing family members */}
        {participants.length > 0 && !showAddForm && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-700">
              Sélectionne ton profil :
            </p>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {participants.map((p) => {
                const isSelected = currentUser?.name?.toLowerCase() === p.name.toLowerCase();
                return (
                  <button
                    key={p.id || p.name}
                    type="button"
                    onClick={() => {
                      selectExistingUser(p);
                      if (onClose) onClose();
                    }}
                    className={`flex items-center gap-2 p-2 rounded-2xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-sun-50 border-sun-400 ring-2 ring-sun-200 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:border-sun-300'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-white border border-sun-200 flex items-center justify-center text-base shadow-2xs">
                      {p.photo ? (
                        <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{p.avatar || '🦁'}</span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                      <p className="text-[9px] text-slate-400 truncate">{p.role || 'Proche'}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-sun-300 text-sun-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-sun-50 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Créer un nouveau profil</span>
            </button>
          </div>
        )}

        {/* Option 2: New participant form */}
        {(showAddForm || participants.length === 0) && (
          <form onSubmit={handleSave} className="space-y-3.5 pt-1">
            {/* Avatar & Photo Picker */}
            <div className="flex flex-col items-center gap-2">
              <label className="relative cursor-pointer group">
                <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-sun-300 bg-amber-50 flex items-center justify-center text-4xl shadow-md group-hover:opacity-90 transition-all">
                  {photo ? (
                    <img src={photo} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <span>{avatar}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-sun-500 text-white p-1.5 rounded-full shadow-md">
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                Clique pour ajouter ta photo 📷
              </span>

              {/* Avatar emojis quick select */}
              <div className="flex gap-1.5 overflow-x-auto max-w-full pb-1">
                {defaultAvatars.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => { setAvatar(emoji); setPhoto(null); }}
                    className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                      avatar === emoji && !photo ? 'bg-sun-200 ring-2 ring-sun-400 scale-110' : 'bg-slate-100 hover:bg-sun-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Pseudo / Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Ton Prénom ou Pseudo :</label>
              <input
                type="text"
                required
                autoFocus
                value={pseudo}
                onChange={e => setPseudo(e.target.value)}
                placeholder="Ex: Maxime, Tata Sarah, Papi..."
                className="w-full px-3 py-2.5 rounded-xl border border-sun-200 bg-amber-50/30 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sun-400"
              />
            </div>

            {/* Role / Link */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Ton Lien :</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sun-200 bg-white text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sun-400"
              >
                {defaultRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sun-500 via-amber-500 to-mint-600 hover:from-sun-600 hover:to-mint-700 text-white font-bold py-3 rounded-2xl shadow-md text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3px]" />
              <span>C'est parti ! 🚀</span>
            </button>

            {participants.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="w-full text-center text-xs text-slate-400 font-bold hover:text-slate-600 pt-1"
              >
                ← Choisir un profil existant
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
