import React from 'react';

/**
 * BabyVectorLogo : Emoji de bébé ultra mignon, doux, chaleureux et 100% adorable.
 * Style emoji officiel Apple / Kawaii épuré : petite bouille ronde souriante, yeux bienveillants et joyeux,
 * bonnet douillet bien positionné sur le front, petite couche et tétine pastel.
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
  const hatGrad = isGirl ? 'url(#girlHatSoftBoy2)' : 'url(#boyHatSoftBoy2)';
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
        <linearGradient id="girlHatSoftBoy2" x1="20" y1="10" x2="80" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBCFE8" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>

        {/* Bonnet Garçon Bleu Pastel */}
        <linearGradient id="boyHatSoftBoy2" x1="20" y1="10" x2="80" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>

        {/* Peau douce avec dégradé subtil */}
        <radialGradient id={`faceGradBoy2_${gender}`} cx="50" cy="52" r="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF2EB" />
          <stop offset="100%" stopColor="#FFE0D4" />
        </radialGradient>
      </defs>

      {/* ========================================== */}
      {/* 1. PETIT CORPS / COUCHE ENTIÈREMENT ENVELOPPÉE */}
      {/* ========================================== */}
      <g>
        {/* Corps emmailloté doux */}
        <ellipse cx="50" cy="76" rx="23" ry="16" fill="#FFFFFF" stroke={outline} strokeWidth="1.8" />
        {/* Petit ruban pastel */}
        <path d="M32 76 Q50 83 68 76" stroke={isGirl ? '#FBCFE8' : '#BAE6FD'} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>

      {/* ========================================== */}
      {/* 2. TÊTE RONDE ET DOUCE (SOUS LE BONNET)   */}
      {/* ========================================== */}
      <circle cx="50" cy="50" r="25" fill={`url(#faceGradBoy2_${gender})`} stroke={outline} strokeWidth="2" />

      {/* Joues bien roses et mignonnes */}
      <circle cx="34" cy="53" r="5" fill={blush} fillOpacity="0.45" />
      <circle cx="66" cy="53" r="5" fill={blush} fillOpacity="0.45" />

      {/* Petits yeux fermés tout souriants et paisibles (^ ^) */}
      <path 
        d="M38 46 Q43 41 48 46" 
        stroke={outline} 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        fill="none" 
      />
      <path 
        d="M52 46 Q57 41 62 46" 
        stroke={outline} 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* ========================================== */}
      {/* 3. TÉTINE DOUCE                            */}
      {/* ========================================== */}
      <g transform="translate(50, 58)">
        {/* Base de la sucette */}
        <circle cx="0" cy="0" r="6.5" fill={paciColor} stroke={outline} strokeWidth="1.5" />
        <circle cx="0" cy="0" r="3" fill={paciGlow} />
        {/* Anneau */}
        <path d="M-3 2 C-3 6 3 6 3 2" stroke={paciGlow} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </g>

      {/* ========================================== */}
      {/* 4. BONNET MOELLEUX (RECOUVRANT PARFAITEMENT LE HAUT DE TÊTE) */}
      {/* ========================================== */}
      {/* Calotte du bonnet recouvrant tout le crâne */}
      <path 
        d="M23 37 C23 10 77 10 77 37 Z" 
        fill={hatGrad} 
        stroke={outline} 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />

      {/* Revers moelleux ajusté sur le front */}
      <rect x="21" y="32" width="58" height="9" rx="4.5" fill={hatGrad} stroke={outline} strokeWidth="1.8" />
      <line x1="31" y1="33" x2="31" y2="40" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
      <line x1="39" y1="33" x2="39" y2="40" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
      <line x1="47" y1="33" x2="47" y2="40" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
      <line x1="55" y1="33" x2="55" y2="40" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
      <line x1="63" y1="33" x2="63" y2="40" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
      <line x1="71" y1="33" x2="71" y2="40" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />

      {/* Décoration du bonnet au sommet */}
      {isGirl ? (
        // Petit nœud papillon fille doré
        <g transform="translate(45, 7)">
          <circle cx="5" cy="5" r="2.5" fill="#FEF08A" stroke={outline} strokeWidth="1.4" />
          <path d="M2.5 5 C-1 2 -1 8 2.5 5 Z" fill="#FEF08A" stroke={outline} strokeWidth="1.4" />
          <path d="M7.5 5 C11 2 11 8 7.5 5 Z" fill="#FEF08A" stroke={outline} strokeWidth="1.4" />
        </g>
      ) : (
        // Pompon tout rond
        <circle cx="50" cy="11" r="6" fill="#FFFFFF" stroke={outline} strokeWidth="1.8" />
      )}
    </svg>
  );
}
