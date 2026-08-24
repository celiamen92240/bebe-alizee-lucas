import React, { useState, useEffect } from 'react';
import { Plus, Camera, Check, User, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { compressImage } from '../utils/imageCompressor';

const RELATION_PRESETS = [
  'Tatie',
  'Tonton',
  'Mamie',
  'Papi',
  'Marraine',
  'Parrain',
  'Maman',
  'Papa',
  'Cousine',
  'Cousin',
  'Ami(e) des parents',
  'Autre proche'
];

export default function ParticipantSelector({ selectedName, onSelect, label = "Qui participe ?" }) {
  const [participants, setParticipants] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Tatie');
  const [customRole, setCustomRole] = useState('');
  const [newPhoto, setNewPhoto] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  const fetchParticipants = () => {
    fetch('/api/participants')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const list = data.participants || [];
          setParticipants(list);
          if (selectedName) {
            const found = list.find(p => p.name?.toLowerCase() === selectedName?.toLowerCase());
            if (found && onSelect) {
              onSelect(found.name, found.photo || found.avatar);
            }
          }
        }
      })
      .catch(err => console.error("Error fetching participants", err));
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handlePhotoUpload = async (e, participantId = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (participantId) setUploadingId(participantId);

    try {
      const base64Photo = await compressImage(file, 400, 400, 0.85);

      if (participantId) {
        const res = await fetch(`/api/participants/${participantId}/photo`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photo: base64Photo })
        });
        const data = await res.json();
        if (data.success) {
          setParticipants(data.participants || []);
          const updated = (data.participants || []).find(p => p.id === participantId);
          if (updated && onSelect) {
            onSelect(updated.name, updated.photo || updated.avatar);
          }
          confetti({ particleCount: 25, spread: 50 });
        }
      } else {
        setNewPhoto(base64Photo);
      }
    } catch (err) {
      console.error("Error processing photo", err);
    } finally {
      if (participantId) setUploadingId(null);
    }
  };

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const finalRole = newRole === 'Autre proche' && customRole.trim() ? customRole.trim() : newRole;

    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          role: finalRole,
          avatar: '🦕',
          photo: newPhoto
        })
      });
      const data = await res.json();
      if (data.success) {
        setParticipants(data.participants || []);
        if (onSelect) {
          onSelect(newName.trim(), newPhoto || '🦕');
        }
        setShowAddModal(false);
        setNewName('');
        setNewRole('Tatie');
        setCustomRole('');
        setNewPhoto(null);
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error("Error adding participant", err);
    }
  };

  const currentSelectedParticipant = participants.find(
    p => p.name?.toLowerCase() === selectedName?.toLowerCase()
  );

  return (
    <div className="space-y-3">
      {/* Label & "+ Nouveau Joueur" Button */}
      <div>
        <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 mb-1.5">
          <User className="w-3.5 h-3.5 text-[#1E4E42]" />
          <span>{label}</span>
        </label>
      </div>

      {/* 1. LISTE DÉROULANTE (SELECT DROPDOWN) */}
      <div className="relative">
        <select
          value={selectedName || ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '__NEW__') {
              setShowAddModal(true);
            } else if (val === '') {
              if (onSelect) onSelect('', null);
            } else {
              const found = participants.find(p => p.name === val);
              if (found && onSelect) {
                onSelect(found.name, found.photo || found.avatar);
              }
            }
          }}
          className="w-full bg-[#FEFCE7] border-2 border-[#EFE89F] text-slate-800 text-xs font-bold py-3 px-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#EFE89F]/50 focus:border-[#D26E7B] cursor-pointer appearance-none shadow-xs transition-all"
        >
          <option value="">-- Sélectionner qui participe --</option>
          {participants.map((p) => (
            <option key={p.id || p.name} value={p.name}>
              {p.name === 'Maman' ? 'Maman' : (p.role && p.role !== p.name && p.role !== 'Famille' ? `${p.name} (${p.role})` : p.name)}
            </option>
          ))}
          <option value="__NEW__">➕ Créer un nouveau joueur...</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#D26E7B] text-xs font-bold">
          ▼
        </div>
      </div>

      {/* 2. APERÇU DU JOUEUR SÉLECTIONNÉ */}
      {currentSelectedParticipant ? (
        <div className="bg-gradient-to-r from-[#ECCEE6]/30 via-white to-[#FEFCE7] rounded-2xl p-3 border-2 border-[#EFE89F] shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white p-0.5 border-2 border-[#D26E7B] shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0">
              {currentSelectedParticipant.photo ? (
                <img
                  src={currentSelectedParticipant.photo}
                  alt={currentSelectedParticipant.name}
                  className="w-full h-full object-cover rounded-[13px]"
                />
              ) : (
                <span className="text-xl">{currentSelectedParticipant.avatar || '🦕'}</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-black text-sm text-slate-800">
                  {currentSelectedParticipant.name}
                </h4>
                {currentSelectedParticipant.name !== 'Maman' && currentSelectedParticipant.role && (
                  <span className="text-[10px] font-black text-[#D26E7B] bg-white px-2 py-0.5 rounded-full border border-[#D26E7B]/30 shadow-2xs">
                    {currentSelectedParticipant.role}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {currentSelectedParticipant.name === 'Maman' ? "Maman d'Alizée 💖" : 'Joueur prêt'}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* 3. MODAL DE CRÉATION DE JOUEUR AVEC PHOTO & LIEN DE PARENTÉ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-[#ECCEE6] space-y-4 animate-in zoom-in-95">
            <div className="text-center space-y-1">
              <span className="text-3xl">💖</span>
              <h3 className="font-serif text-lg font-black text-slate-800">
                Créer mon Profil de Joueur
              </h3>
              <p className="text-xs text-[#D26E7B] font-semibold">
                Ajoute ton prénom, ton lien et ta photo pour les pronos et quizz !
              </p>
            </div>

            <form onSubmit={handleAddParticipant} className="space-y-4">
              {/* Photo Upload Preview */}
              <div className="flex flex-col items-center gap-2">
                <label className="w-20 h-20 rounded-3xl border-2 border-dashed border-[#D26E7B] flex flex-col items-center justify-center cursor-pointer bg-[#FEFCE7] hover:bg-[#faebf4] relative overflow-hidden shadow-xs transition-all group">
                  {newPhoto ? (
                    <img src={newPhoto} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-1">
                      <div className="w-8 h-8 rounded-full bg-[#D26E7B]/20 text-[#D26E7B] flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4 stroke-[2.5px]" />
                      </div>
                      <span className="text-[9px] font-black text-[#D26E7B]">Ma Photo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e, null)}
                  />
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  {newPhoto ? '✅ Photo prête !' : 'Clique pour choisir une photo ou un selfie'}
                </span>
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Ton Prénom *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Ex: Célia, Julien, Mamie..."
                  className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border-2 border-[#EFE89F] bg-[#FEFCE7] focus:outline-none focus:border-[#D26E7B]"
                />
              </div>

              {/* Lien de Parenté */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Lien de parenté / Rôle *
                </label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border-2 border-[#EFE89F] bg-[#FEFCE7] focus:outline-none focus:border-[#D26E7B] cursor-pointer"
                >
                  {RELATION_PRESETS.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>

                {newRole === 'Autre proche' && (
                  <input
                    type="text"
                    required
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value)}
                    placeholder="Précise ton lien (ex: Voisin, Collègue...)"
                    className="w-full text-xs font-bold px-3.5 py-2 mt-2 rounded-xl border-2 border-[#EFE89F] bg-[#FEFCE7] focus:outline-none focus:border-[#D26E7B]"
                  />
                )}
              </div>

              {/* Actions Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold text-xs py-3 rounded-2xl hover:bg-slate-200 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#D26E7B] to-[#be5361] text-white font-black text-xs py-3 rounded-2xl shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enregistrer ✨</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
