import React from 'react';

/**
 * BabyVectorLogo : Emoji smartphone de bébé stylisé, design et raffiné
 * Silhouette équilibrée avec tête ronde bien distincte, corps potelé, gros bonnet, couche, chaussons et biberon.
 */
export default function BabyVectorLogo({ 
  gender = 'boy', // 'boy' | 'girl'
  size = 64, 
  className = '' 
}) {
  const isGirl = gender === 'girl';

  // Couleurs fines et douces
  const outlineColor = isGirl ? '#8b264e' : '#1b4332';
  const skinColor = '#FFE8DF';
  const blushColor = isGirl ? '#F472B6' : '#FB7185';
  const eyeColor = isGirl ? '#38BDF8' : '#60A5FA';
  const hatGrad = isGirl ? 'url(#girlBeanieGrad)' : 'url(#boyBeanieGrad)';
  const diaperFill = '#FFFFFF';
  const diaperShadow = isGirl ? '#FCE7F3' : '#E0F2FE';
  const bootieFill = isGirl ? '#F472B6' : '#60A5FA';
  const bottleCap = isGirl ? '#EC4899' : '#3B82F6';

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 110" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-sm transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <defs>
        {/* Dégradé Bonnet Fille Rose */}
        <linearGradient id="girlBeanieGrad" x1="20" y1="5" x2="80" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBCFE8" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>

        {/* Dégradé Bonnet Garçon Bleu */}
        <linearGradient id="boyBeanieGrad" x1="20" y1="5" x2="80" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>

        {/* Biberon lait */}
        <linearGradient id="milkLevelGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFFBEB" />
        </linearGradient>
      </defs>

      {/* ======================================================== */}
      {/* 1. JAMBES ET PETITS CHAUSSONS (EN BAS)                   */}
      {/* ======================================================== */}
      {/* Jambe & Chausson Gauche */}
      <g>
        <path d="M30 76 Q26 86 32 94 Q40 94 40 84" fill={skinColor} stroke={outlineColor} strokeWidth="1.6" />
        {/* Chausson Gauche */}
        <rect x="25" y="86" width="16" height="10" rx="5" fill={bootieFill} stroke={outlineColor} strokeWidth="1.6" />
        <line x1="29" y1="88" x2="29" y2="94" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <line x1="33" y1="88" x2="33" y2="94" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Jambe & Chausson Droit */}
      <g>
        <path d="M70 76 Q74 86 68 94 Q60 94 60 84" fill={skinColor} stroke={outlineColor} strokeWidth="1.6" />
        {/* Chausson Droit */}
        <rect x="59" y="86" width="16" height="10" rx="5" fill={bootieFill} stroke={outlineColor} strokeWidth="1.6" />
        <line x1="67" y1="88" x2="67" y2="94" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <line x1="71" y1="88" x2="71" y2="94" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* ======================================================== */}
      {/* 2. CORPS POTELÉ & GROSSE COUCHE MOELLEUSE                */}
      {/* ======================================================== */}
      {/* Torse de bébé */}
      <path d="M34 52 Q30 68 36 78 Q50 82 64 78 Q70 68 66 52 Z" fill={skinColor} stroke={outlineColor} strokeWidth="1.6" />

      {/* Grosse Couche Blanche */}
      <path 
        d="M31 66 C31 85 69 85 69 66 C69 64 31 64 31 66 Z" 
        fill={diaperFill} 
        stroke={outlineColor} 
        strokeWidth="1.8" 
        strokeLinejoin="round" 
      />
      {/* Ombrage arrondi de la couche */}
      <path d="M34 72 C43 83 57 83 66 72 C63 80 37 80 34 72 Z" fill={diaperShadow} />

      {/* Attaches latérales de la couche */}
      <rect x="29" y="65" width="6" height="5" rx="2" fill={bootieFill} stroke={outlineColor} strokeWidth="1.2" />
      <rect x="65" y="65" width="6" height="5" rx="2" fill={bootieFill} stroke={outlineColor} strokeWidth="1.2" />

      {/* ======================================================== */}
      {/* 3. TÊTE RONDE DE BÉBÉ BIEN DISTINCTE                    */}
      {/* ======================================================== */}
      <circle cx="50" cy="38" r="22" fill={skinColor} stroke={outlineColor} strokeWidth="1.8" />

      {/* Joues rosées d'émoji */}
      <circle cx="36" cy="42" r="4.5" fill={blushColor} fillOpacity="0.35" />
      <circle cx="64" cy="42" r="4.5" fill={blushColor} fillOpacity="0.35" />

      {/* Yeux Clairs Épurés avec petits reflets */}
      <circle cx="41" cy="37" r="2.8" fill={eyeColor} stroke={outlineColor} strokeWidth="0.8" />
      <circle cx="42" cy="36" r="1" fill="#FFFFFF" />

      <circle cx="59" cy="37" r="2.8" fill={eyeColor} stroke={outlineColor} strokeWidth="0.8" />
      <circle cx="60" cy="36" r="1" fill="#FFFFFF" />

      {/* Petit sourire émoji doux */}
      <path d="M47 43 Q50 46 53 43" stroke={outlineColor} strokeWidth="1.6" strokeLinecap="round" fill="none" />

      {/* ======================================================== */}
      {/* 4. GROS BONNET EN TRICOT AVEC REVERS & POMPON/NŒUD       */}
      {/* ======================================================== */}
      {/* Dôme du bonnet */}
      <path 
        d="M28 34 C28 14 72 14 72 34 Z" 
        fill={hatGrad} 
        stroke={outlineColor} 
        strokeWidth="1.8" 
        strokeLinejoin="round" 
      />

      {/* Revers moelleux du bonnet */}
      <rect x="25" y="27" width="50" height="9" rx="4.5" fill={hatGrad} stroke={outlineColor} strokeWidth="1.8" />

      {/* Lignes fines de tricot sur le revers */}
      <line x1="33" y1="28" x2="33" y2="35" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <line x1="41" y1="28" x2="41" y2="35" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <line x1="49" y1="28" x2="49" y2="35" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <line x1="57" y1="28" x2="57" y2="35" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <line x1="65" y1="28" x2="65" y2="35" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />

      {/* Décoration du sommet : Nœud doré fille ou Pompon garçon */}
      {isGirl ? (
        <g transform="translate(44, 9)">
          <circle cx="6" cy="6" r="3" fill="#FDE68A" stroke={outlineColor} strokeWidth="1.4" />
          <path d="M3 6 C-1 2 -1 10 3 6 Z" fill="#FDE68A" stroke={outlineColor} strokeWidth="1.4" />
          <path d="M9 6 C13 2 13 10 9 6 Z" fill="#FDE68A" stroke={outlineColor} strokeWidth="1.4" />
        </g>
      ) : (
        <circle cx="50" cy="12" r="6" fill="#FFFFFF" stroke={outlineColor} strokeWidth="1.8" />
      )}

      {/* ======================================================== */}
      {/* 5. BRAS & PETIT BIBERON DE LAIT                          */}
      {/* ======================================================== */}
      {/* Biberon tenu par le bébé */}
      <g transform="translate(56, 48) rotate(14)">
        {/* Corps en verre */}
        <rect x="0" y="6" width="11" height="17" rx="3" fill="url(#milkLevelGrad)" stroke={outlineColor} strokeWidth="1.5" />
        {/* Bague colorée */}
        <rect x="-1" y="3" width="13" height="3.5" rx="1.5" fill={bottleCap} stroke={outlineColor} strokeWidth="1.3" />
        {/* Tétine dorée */}
        <path d="M3 3 C3 0 8 0 8 3 Z" fill="#FDE68A" stroke={outlineColor} strokeWidth="1.3" />
        {/* Graduations */}
        <line x1="2" y1="10" x2="5" y2="10" stroke={outlineColor} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        <line x1="2" y1="14" x2="5" y2="14" stroke={outlineColor} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        <line x1="2" y1="18" x2="5" y2="18" stroke={outlineColor} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* Bras potelés entourant le biberon */}
      <path d="M32 54 C36 64 48 64 58 56" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 54 C36 64 48 64 58 56" stroke={skinColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

