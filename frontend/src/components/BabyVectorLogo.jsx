import React from 'react';

/**
 * BabyVectorLogo : Logo vectoriel numérique en traits fins épurés et design
 * Conçu par ordinateur avec contours fins, yeux clairs, gros bonnet, couche, chaussons et biberon.
 */
export default function BabyVectorLogo({ 
  gender = 'boy', // 'boy' | 'girl'
  size = 56, 
  className = '' 
}) {
  const isGirl = gender === 'girl';

  // Palette de couleurs fines
  const outlineColor = isGirl ? '#9d2d5a' : '#1e483f';
  const hatFill = isGirl ? 'url(#girlHatGrad)' : 'url(#boyHatGrad)';
  const bodyFill = '#FFF2EB';
  const diaperFill = '#FFFFFF';
  const diaperShadow = isGirl ? '#FCDDE8' : '#DCEBE6';
  const bootieFill = isGirl ? '#F8B4D0' : '#A3C8F0';
  const bottleCap = isGirl ? '#F2619C' : '#6999E6';
  const eyeColor = isGirl ? '#60A5FA' : '#38BDF8'; // Yeux clairs doux

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-xs transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <defs>
        {/* Dégradé Bonnet Fille */}
        <linearGradient id="girlHatGrad" x1="20" y1="10" x2="80" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFAEC9" />
          <stop offset="100%" stopColor="#F2619C" />
        </linearGradient>

        {/* Dégradé Bonnet Garçon */}
        <linearGradient id="boyHatGrad" x1="20" y1="10" x2="80" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BCE0FD" />
          <stop offset="100%" stopColor="#87B7EB" />
        </linearGradient>

        {/* Ombre douce biberon */}
        <linearGradient id="milkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF9E6" />
        </linearGradient>
      </defs>

      {/* 1. CORPS & PEAU DU BÉBÉ */}
      <circle cx="50" cy="46" r="23" fill={bodyFill} stroke={outlineColor} strokeWidth="1.8" />

      {/* Joues rosées douces */}
      <circle cx="38" cy="51" r="3.5" fill="#FFB6C1" fillOpacity="0.45" />
      <circle cx="62" cy="51" r="3.5" fill="#FFB6C1" fillOpacity="0.45" />

      {/* Yeux Clairs Épurés (Deux billes douces) */}
      <circle cx="41" cy="46" r="2.6" fill={eyeColor} stroke={outlineColor} strokeWidth="0.8" />
      <circle cx="42" cy="45.2" r="0.9" fill="#FFFFFF" />

      <circle cx="59" cy="46" r="2.6" fill={eyeColor} stroke={outlineColor} strokeWidth="0.8" />
      <circle cx="60" cy="45.2" r="0.9" fill="#FFFFFF" />

      {/* Petit sourire fin */}
      <path 
        d="M47 52 Q50 55 53 52" 
        stroke={outlineColor} 
        strokeWidth="1.6" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* 2. GROS BONNET EN TRICOT */}
      {/* Forme principale du bonnet */}
      <path 
        d="M27 42 C27 20 73 20 73 42 C73 44 27 44 27 42 Z" 
        fill={hatFill} 
        stroke={outlineColor} 
        strokeWidth="1.8" 
        strokeLinejoin="round" 
      />

      {/* Revers côtelé du bonnet */}
      <rect 
        x="25" 
        y="36" 
        width="50" 
        height="8" 
        rx="4" 
        fill={hatFill} 
        stroke={outlineColor} 
        strokeWidth="1.8" 
      />

      {/* Lignes de tricot côtelé ultra fines */}
      <line x1="33" y1="36" x2="33" y2="44" stroke={outlineColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="41" y1="36" x2="41" y2="44" stroke={outlineColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="49" y1="36" x2="49" y2="44" stroke={outlineColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="57" y1="36" x2="57" y2="44" stroke={outlineColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="65" y1="36" x2="65" y2="44" stroke={outlineColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

      {/* Pompon ou Nœud du Bonnet */}
      {isGirl ? (
        // Petit nœud raffiné
        <g transform="translate(45, 13)">
          <circle cx="5" cy="5" r="2.5" fill="#FFE58F" stroke={outlineColor} strokeWidth="1.4" />
          <path d="M2.5 5 C-1 2 -1 8 2.5 5 Z" fill="#FFE58F" stroke={outlineColor} strokeWidth="1.4" />
          <path d="M7.5 5 C11 2 11 8 7.5 5 Z" fill="#FFE58F" stroke={outlineColor} strokeWidth="1.4" />
        </g>
      ) : (
        // Pompon moelleux
        <circle cx="50" cy="18" r="6" fill="#FFFFFF" stroke={outlineColor} strokeWidth="1.8" strokeDasharray="3 1" />
      )}

      {/* 3. GROSSE COUCHE MOELLEUSE */}
      <path 
        d="M32 64 C32 80 68 80 68 64 C68 60 32 60 32 64 Z" 
        fill={diaperFill} 
        stroke={outlineColor} 
        strokeWidth="1.8" 
        strokeLinejoin="round" 
      />
      {/* Ombrage doux sur la couche */}
      <path 
        d="M34 68 C42 77 58 77 66 68 C63 76 37 76 34 68 Z" 
        fill={diaperShadow} 
      />

      {/* Attaches de la couche */}
      <rect x="30" y="62" width="7" height="4" rx="2" fill={bootieFill} stroke={outlineColor} strokeWidth="1.2" />
      <rect x="63" y="62" width="7" height="4" rx="2" fill={bootieFill} stroke={outlineColor} strokeWidth="1.2" />

      {/* 4. PETITS CHAUSSONS TRICOTÉS */}
      {/* Chausson Gauche */}
      <g transform="translate(30, 75)">
        <rect x="0" y="0" width="14" height="9" rx="4.5" fill={bootieFill} stroke={outlineColor} strokeWidth="1.8" />
        <line x1="3" y1="2" x2="3" y2="7" stroke={outlineColor} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <line x1="7" y1="2" x2="7" y2="7" stroke={outlineColor} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Chausson Droit */}
      <g transform="translate(56, 75)">
        <rect x="0" y="0" width="14" height="9" rx="4.5" fill={bootieFill} stroke={outlineColor} strokeWidth="1.8" />
        <line x1="7" y1="2" x2="7" y2="7" stroke={outlineColor} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <line x1="11" y1="2" x2="11" y2="7" stroke={outlineColor} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* 5. PETIT BIBERON EN TRAITS FINS */}
      <g transform="translate(62, 46) rotate(12)">
        {/* Corps de la bouteille */}
        <rect x="0" y="6" width="12" height="18" rx="3.5" fill="url(#milkGrad)" stroke={outlineColor} strokeWidth="1.6" />
        {/* Bague/Bouchon */}
        <rect x="-1" y="3" width="14" height="4" rx="1.5" fill={bottleCap} stroke={outlineColor} strokeWidth="1.4" />
        {/* Tétine */}
        <path d="M3.5 3 C3.5 0 8.5 0 8.5 3 Z" fill="#FFE58F" stroke={outlineColor} strokeWidth="1.4" />
        {/* Graduation */}
        <line x1="2.5" y1="11" x2="5.5" y2="11" stroke={outlineColor} strokeWidth="1" strokeLinecap="round" />
        <line x1="2.5" y1="15" x2="5.5" y2="15" stroke={outlineColor} strokeWidth="1" strokeLinecap="round" />
        <line x1="2.5" y1="19" x2="5.5" y2="19" stroke={outlineColor} strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Petits bras doux tenant le biberon */}
      <path 
        d="M34 56 C40 60 48 58 60 56" 
        stroke={outlineColor} 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        fill="none" 
      />
    </svg>
  );
}
