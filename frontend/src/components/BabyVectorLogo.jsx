import React from 'react';

/**
 * BabyVectorLogo : Emoji de bébé ultra mignon, doux, chaleureux et 100% adorable.
 * Style emoji officiel Apple / Kawaii épuré : petite bouille ronde souriante, yeux bienveillants et joyeux,
 * bonnet douillet, petite couche et tétine pastel. Zéro élément réaliste ou étrange.
 */
export default function BabyVectorLogo({ 
  gender = 'boy', // 'boy' | 'girl'
  size = 68, 
  className = '' 
}) {
  const isGirl = gender === 'girl';

  // Palette ultra douce & rassurante
  const outline = isGirl ? '#831843' : '#14532D';
  const skin = '#FFE6DC';
  const blush = isGirl ? '#F472B6' : '#FB7185';
  const hatGrad = isGirl ? 'url(#girlHatSoft)' : 'url(#boyHatSoft)';
  const paciColor = isGirl ? '#EC4899' : '#3B82F6';
  const paciGlow = isGirl ? '#FDF2F8' : '#EFF6FF';

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-sm transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <defs>
        {/* Bonnet Fille Rose Guimauve */}
        <linearGradient id="girlHatSoft" x1="20" y1="10" x2="80" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBCFE8" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>

        {/* Bonnet Garçon Bleu Pastel */}
        <linearGradient id="boyHatSoft" x1="20" y1="10" x2="80" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>

        {/* Peau douce avec dégradé subtil */}
        <radialGradient id={`faceGrad_${gender}`} cx="50" cy="48" r="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF2EB" />
          <stop offset="100%" stopColor="#FFE0D4" />
        </radialGradient>
      </defs>

      {/* ========================================== */}
      {/* 1. PETIT CORPS / COUCHE ENTIÈREMENT ENVELOPPÉE */}
      {/* ========================================== */}
      <g>
        {/* Corps emmailloté doux */}
        <ellipse cx="50" cy="74" rx="24" ry="18" fill="#FFFFFF" stroke={outline} strokeWidth="1.8" />
        {/* Petit ruban / liseré pastel */}
        <path d="M30 74 Q50 82 70 74" stroke={isGirl ? '#FBCFE8' : '#BAE6FD'} strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>

      {/* ========================================== */}
      {/* 2. TÊTE RONDE ET DOUCE                    */}
      {/* ========================================== */}
      <circle cx="50" cy="46" r="26" fill={`url(#faceGrad_${gender})`} stroke={outline} strokeWidth="2" />

      {/* Joues bien roses et mignonnes */}
      <circle cx="34" cy="50" r="5" fill={blush} fillOpacity="0.45" />
      <circle cx="66" cy="50" r="5" fill={blush} fillOpacity="0.45" />

      {/* Petits yeux fermés tout souriants et paisibles (^ ^) */}
      <path 
        d="M38 43 Q43 38 48 43" 
        stroke={outline} 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        fill="none" 
      />
      <path 
        d="M52 43 Q57 38 62 43" 
        stroke={outline} 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* ========================================== */}
      {/* 3. TÉTINE DOUCE EN FORME DE COEUR          */}
      {/* ========================================== */}
      <g transform="translate(50, 55)">
        {/* Base de la sucette */}
        <circle cx="0" cy="0" r="6.5" fill={paciColor} stroke={outline} strokeWidth="1.5" />
        <circle cx="0" cy="0" r="3.2" fill={paciGlow} />
        {/* Petit anneau */}
        <path d="M-3 2 C-3 6 3 6 3 2" stroke={paciGlow} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </g>

      {/* ========================================== */}
      {/* 4. BONNET MOELLEUX TRICOTÉ                 */}
      {/* ========================================== */}
      {/* Dôme du bonnet */}
      <path 
        d="M26 42 C26 18 74 18 74 42 Z" 
        fill={hatGrad} 
        stroke={outline} 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />

      {/* Revers moelleux avec lignes douces */}
      <rect x="23" y="36" width="54" height="9" rx="4.5" fill={hatGrad} stroke={outline} strokeWidth="1.8" />
      <line x1="32" y1="37" x2="32" y2="44" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
      <line x1="41" y1="37" x2="41" y2="44" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
      <line x1="50" y1="37" x2="50" y2="44" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
      <line x1="59" y1="37" x2="59" y2="44" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
      <line x1="68" y1="37" x2="68" y2="44" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />

      {/* Décoration du bonnet au sommet */}
      {isGirl ? (
        // Petit nœud papillon fille
        <g transform="translate(45, 14)">
          <circle cx="5" cy="5" r="2.5" fill="#FEF08A" stroke={outline} strokeWidth="1.4" />
          <path d="M2.5 5 C-1 2 -1 8 2.5 5 Z" fill="#FEF08A" stroke={outline} strokeWidth="1.4" />
          <path d="M7.5 5 C11 2 11 8 7.5 5 Z" fill="#FEF08A" stroke={outline} strokeWidth="1.4" />
        </g>
      ) : (
        // Pompon tout rond
        <circle cx="50" cy="18" r="6" fill="#FFFFFF" stroke={outline} strokeWidth="1.8" />
      )}
    </svg>
  );
}
