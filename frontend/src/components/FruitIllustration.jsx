import React from 'react';

/**
 * FruitIllustration : Illustrations vectorielles modernes, gourmandes et design
 * pour chaque fruit / légume de l'évolution semaine après semaine.
 */
export default function FruitIllustration({ fruit = 'Aubergine', size = 52, className = '' }) {
  const name = (fruit || '').toLowerCase();

  // 1. BELLE AUBERGINE (Semaine 26) - Brillante, galbée, pourpre satiné avec son pédoncule vert émeraude
  if (name.includes('aubergine')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="eggplantGrad" x1="20" y1="20" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8A2BE2" />
            <stop offset="35%" stopColor="#5E118A" />
            <stop offset="80%" stopColor="#380854" />
            <stop offset="100%" stopColor="#230238" />
          </linearGradient>
          <linearGradient id="calyxGrad" x1="50" y1="5" x2="50" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="50%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <radialGradient id="eggplantGlow" cx="40" cy="45" r="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#5E118A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ombre portée douce */}
        <ellipse cx="50" cy="88" rx="26" ry="6" fill="#1E1B4B" fillOpacity="0.18" />

        {/* Corps galbé de l'aubergine */}
        <path 
          d="M48 24 C38 24 32 38 30 52 C27 68 34 84 50 84 C66 84 73 68 70 52 C68 38 60 24 50 24 Z" 
          fill="url(#eggplantGrad)" 
          stroke="#1F042E" 
          strokeWidth="1.8" 
          strokeLinejoin="round" 
        />

        {/* Éclat de lumière satiné */}
        <path 
          d="M37 38 C34 46 34 60 38 70" 
          stroke="url(#eggplantGlow)" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeOpacity="0.75" 
        />
        <path 
          d="M38 42 C36 48 36 56 39 64" 
          stroke="#FFFFFF" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeOpacity="0.85" 
        />

        {/* Reflet secondaire doux à droite */}
        <path 
          d="M62 48 C64 56 63 68 59 74" 
          stroke="#A855F7" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeOpacity="0.4" 
        />

        {/* Calice / Chapeau vert feuillu de l'aubergine */}
        <path 
          d="M50 22 C43 20 34 26 31 34 C36 31 42 32 44 26 C46 33 54 34 56 26 C58 32 64 31 69 34 C66 26 57 20 50 22 Z" 
          fill="url(#calyxGrad)" 
          stroke="#14532D" 
          strokeWidth="1.5" 
          strokeLinejoin="round" 
        />

        {/* Pédoncule (tige verte courbée) */}
        <path 
          d="M50 22 C49 14 54 10 57 7 C55 9 52 14 53 22" 
          fill="#4ADE80" 
          stroke="#14532D" 
          strokeWidth="2.4" 
          strokeLinecap="round" 
        />
      </svg>
    );
  }

  // 2. NAVET GOURMAND (Semaine 25) - Blanc nacré avec dégradé fuchsia/violet au sommet et belles fanes vertes
  if (name.includes('navet')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="turnipGrad" x1="50" y1="25" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DB2777" />
            <stop offset="35%" stopColor="#F472B6" />
            <stop offset="65%" stopColor="#FFF1F2" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="50" y1="5" x2="50" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="88" rx="22" ry="5" fill="#000000" fillOpacity="0.12" />
        {/* Corps bulbeux */}
        <path d="M50 32 C30 32 26 55 35 72 C42 84 50 88 50 88 C50 88 58 84 65 72 C74 55 70 32 50 32 Z" fill="url(#turnipGrad)" stroke="#831843" strokeWidth="1.8" />
        {/* Petite racine en pointe */}
        <path d="M50 88 Q51 94 54 96" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Fanes vertes */}
        <path d="M50 32 C45 20 38 12 30 8 C38 18 44 26 48 32 Z" fill="url(#leafGrad)" stroke="#14532D" strokeWidth="1.4" />
        <path d="M50 32 C50 16 52 10 54 6 C55 16 54 26 52 32 Z" fill="url(#leafGrad)" stroke="#14532D" strokeWidth="1.4" />
        <path d="M50 32 C55 20 62 12 70 8 C62 18 56 26 52 32 Z" fill="url(#leafGrad)" stroke="#14532D" strokeWidth="1.4" />
      </svg>
    );
  }

  // 3. BANANE (Semaine 20)
  if (name.includes('banane')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M22 68 C35 84 68 84 80 44 C82 36 78 30 72 32 C60 62 38 68 28 58 Z" fill="#FDE047" stroke="#A16207" strokeWidth="1.8" />
        <path d="M22 68 C20 69 16 67 18 64 L24 60" stroke="#713F12" strokeWidth="2" strokeLinecap="round" />
        <path d="M80 44 L86 38" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. MANGUE / PAPAYE (Semaine 23 / 35)
  if (name.includes('mangue') || name.includes('papaye')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="mangoGrad" x1="25" y1="25" x2="75" y2="75">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FACC15" />
          </linearGradient>
        </defs>
        <path d="M50 22 C34 22 28 40 32 60 C36 80 54 84 66 74 C78 64 74 42 66 30 C60 22 55 22 50 22 Z" fill="url(#mangoGrad)" stroke="#B45309" strokeWidth="1.8" />
        <path d="M50 22 C50 16 52 12 54 9" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 5. CITROUILLE / COURGE (Semaine 37, 40, 41)
  if (name.includes('citrouille') || name.includes('courge')) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="pumpkinGrad" x1="20" y1="30" x2="80" y2="80">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="58" rx="36" ry="24" fill="url(#pumpkinGrad)" stroke="#9A3412" strokeWidth="1.8" />
        <ellipse cx="50" cy="58" rx="22" ry="24" fill="url(#pumpkinGrad)" stroke="#9A3412" strokeWidth="1.5" />
        <ellipse cx="50" cy="58" rx="10" ry="24" fill="url(#pumpkinGrad)" stroke="#9A3412" strokeWidth="1.5" />
        <path d="M50 36 C49 26 53 20 57 16" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 6. DEFAULT FRUIT VECTOR (Fraise / Pomme gourmande)
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="berryGrad" x1="30" y1="20" x2="70" y2="80">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="54" r="28" fill="url(#berryGrad)" stroke="#881337" strokeWidth="1.8" />
      <path d="M50 26 C48 18 52 14 56 10" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 26 C46 22 54 22 58 26" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
