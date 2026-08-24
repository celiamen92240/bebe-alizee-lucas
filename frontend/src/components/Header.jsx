import React, { useState, useEffect } from 'react';
import { Lock, Heart, User, Sparkles, Camera, Plus } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { compressImage } from '../utils/imageCompressor';

export default function Header({ onAdminClick, isBorn }) {
  const { currentUser, setIsRegisterModalOpen } = useUser();
  const [headerPhoto, setHeaderPhoto] = useState(null);

  // Fetch custom header photo from settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.customHeaderPhoto) {
          setHeaderPhoto(data.settings.customHeaderPhoto);
        }
      })
      .catch(err => console.error("Error loading header photo", err));
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 400, 400, 0.85);
        setHeaderPhoto(compressed);
        window.dispatchEvent(new CustomEvent('customHeaderPhotoChanged', { detail: compressed }));
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customHeaderPhoto: compressed })
        });
      } catch (err) {
        console.error("Error uploading header photo", err);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#EFE89F] px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between">
        {/* Logo / Custom Photo with + button & Baby Boy Title */}
        <div className="flex items-center gap-2.5">
          <div className="relative group">
            <label className="cursor-pointer block">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D26E7B] via-[#EFE89F] to-[#92AFEC] p-0.5 shadow-sm flex items-center justify-center border border-[#C5D88F] overflow-hidden bg-white">
                {headerPhoto ? (
                  <img src={headerPhoto} alt="Photo" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <img src="/logo.jpg" alt="Alizée & Lucas" className="w-full h-full object-cover rounded-xl" />
                )}
              </div>
              <div
                className="absolute -bottom-1 -right-1 bg-[#D26E7B] hover:bg-[#be5361] text-white p-0.5 rounded-full shadow-md transition-transform group-hover:scale-110 flex items-center justify-center border border-white"
                title="Ajouter ou modifier la photo du haut (+)"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3px]" />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif text-xl font-black text-[#1E4E42] tracking-tight leading-none">
                Alizée & Lucas
              </h1>
              <span className="text-[10px] font-black text-[#1E4E42] bg-[#EFE89F] px-2.5 py-0.5 rounded-full border border-[#C5D88F]">
                Garçon 🦕
              </span>
            </div>
            <p className="text-[11px] font-bold text-[#D26E7B] flex items-center gap-1 mt-0.5">
              <span>💙 En attendant notre petit prince</span>
            </p>
          </div>
        </div>

        {/* Right Action: Admin Lock only */}
        <div className="flex items-center gap-2">
          {/* Parents Space Lock */}
          <button
            type="button"
            onClick={onAdminClick}
            className="w-9 h-9 rounded-2xl bg-white/90 hover:bg-[#fbfbe9] border-2 border-[#92AFEC] flex items-center justify-center text-[#D26E7B] transition-all shadow-xs cursor-pointer"
            title="Espace Parents"
          >
            <Lock className="w-4 h-4 text-[#D26E7B]" />
          </button>
        </div>
      </div>
    </header>
  );
}
