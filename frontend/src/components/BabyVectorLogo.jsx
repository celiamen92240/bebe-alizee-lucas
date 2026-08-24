import React from 'react';

/**
 * BabyVectorLogo : Bébé mignon rampant avec tétine, couche, petite mèche de cheveux et yeux doux
 * Inspiré directement du style kawaii / émoji de référence Pinterest épuré.
 */
export default function BabyVectorLogo({ 
  gender = 'boy', // 'boy' | 'girl'
  size = 72, 
  className = '' 
}) {
  const isGirl = gender === 'girl';

  // Palette de contours et couleurs douces
  const outline = isGirl ? '#782046' : '#1e3a34';
  const skin = '#FFE9E0';
  const skinShadow = '#FCD2C4';
  const blush = isGirl ? '#FB7185' : '#F472B6';
  const hair = '#C28862';
  const eyeColor = isGirl ? '#38BDF8' : '#60A5FA';
  const paciBase = isGirl ? '#F472B6' : '#60A5FA';
  const paciRing = isGirl ? '#FDA4AF' : '#93C5FD';
  const diaper = '#FFFFFF';
  const diaperBorder = isGirl ? '#FBCFE8' : '#BAE6FD';

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-sm transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <defs>
        {/* Dégradé doux peau */}
        <radialGradient id={`babySkinGrad_${gender}`} cx="45" cy="40" r="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF2EC" />
          <stop offset="100%" stopColor="#FFE4D9" />
        </radialGradient>
      </defs>

      {/* ========================================== */}
      {/* 1. JAMBE ARRIÈRE & PETIT PIED              */}
      {/* ========================================== */}
      <g>
        {/* Cuisse & Pied droit étendu en arrière */}
        <path 
          d="M74 68 C84 68 94 72 98 80 C100 84 98 88 94 88 C90 88 88 84 84 82 C80 80 75 80 72 78" 
          fill={skin} 
          stroke={outline} 
          strokeWidth="1.8" 
          strokeLinejoin="round" 
        />
        {/* Petit orteil */}
        <circle cx="97" cy="85" r="2" fill={skinShadow} />
      </g>

      {/* ========================================== */}
      {/* 2. CORPS & COUCHE (À QUATRE PATTES)        */}
      {/* ========================================== */}
      {/* Torse / Dos de bébé */}
      <path 
        d="M48 56 C56 56 68 58 76 66 C72 74 64 78 52 74 C46 72 44 64 48 56 Z" 
        fill={skin} 
      />

      {/* Grosse Couche Moelleuse */}
      <path 
        d="M58 64 C64 62 74 64 80 70 C78 78 72 84 62 82 C56 80 56 72 58 64 Z" 
        fill={diaper} 
        stroke={outline} 
        strokeWidth="1.8" 
        strokeLinejoin="round" 
      />
      <path 
        d="M62 80 C70 82 76 76 78 70" 
        stroke={diaperBorder} 
        strokeWidth="1.8" 
        strokeLinecap="round" 
      />

      {/* ========================================== */}
      {/* 3. BRAS & PETITES MAINS EN AVANT           */}
      {/* ========================================== */}
      {/* Bras Arrière Gauche */}
      <path 
        d="M36 60 L30 76 C28 80 34 82 36 78 L42 64" 
        fill={skin} 
        stroke={outline} 
        strokeWidth="1.6" 
        strokeLinejoin="round" 
      />
      {/* Main Gauche au sol */}
      <ellipse cx="32" cy="79" rx="4" ry="2.5" fill={skin} stroke={outline} strokeWidth="1.4" />

      {/* Bras Avant Droit */}
      <path 
        d="M46 58 C46 68 44 76 44 80 C44 83 49 84 51 81 C53 76 54 68 54 58" 
        fill={skin} 
        stroke={outline} 
        strokeWidth="1.8" 
        strokeLinejoin="round" 
      />
      {/* Main Droite posée au sol avec petits doigts */}
      <path 
        d="M42 81 C42 83 44 85 48 85 C51 85 53 83 53 81" 
        fill={skin} 
        stroke={outline} 
        strokeWidth="1.6" 
      />

      {/* ========================================== */}
      {/* 4. TÊTE RONDE DE BÉBÉ                      */}
      {/* ========================================== */}
      <path 
        d="M26 42 C24 24 42 14 58 14 C76 14 90 26 88 44 C86 58 74 66 58 66 C42 66 28 56 26 42 Z" 
        fill={`url(#babySkinGrad_${gender})`} 
        stroke={outline} 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />

      {/* Oreille Gauche */}
      <ellipse cx="27" cy="44" rx="3.5" ry="4.5" fill={skin} stroke={outline} strokeWidth="1.6" />
      <circle cx="27" cy="44" r="1.5" fill={skinShadow} />

      {/* Oreille Droite */}
      <ellipse cx="88" cy="44" rx="3.5" ry="4.5" fill={skin} stroke={outline} strokeWidth="1.6" />
      <circle cx="88" cy="44" r="1.5" fill={skinShadow} />

      {/* ========================================== */}
      {/* 5. MÈCHE DE CHEVEUX BOUCLÉE AU SOMMET      */}
      {/* ========================================== */}
      <path 
        d="M52 14 C50 8 58 4 60 8 C62 10 58 12 62 14" 
        stroke={hair} 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        fill={hair} 
      />
      <path 
        d="M56 14 C58 10 65 9 66 12 C67 14 62 14 62 15" 
        stroke={hair} 
        strokeWidth="1.6" 
        strokeLinecap="round" 
      />

      {/* ========================================== */}
      {/* 6. YEUX EXPRESSIFS & SOURCILS FINS         */}
      {/* ========================================== */}
      {/* Sourcils fins */}
      <path d="M38 31 Q44 28 48 31" stroke={hair} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M66 31 Q70 28 76 31" stroke={hair} strokeWidth="1.4" strokeLinecap="round" fill="none" />

      {/* Œil Gauche */}
      <g>
        <ellipse cx="43" cy="38" rx="4.5" ry="5.5" fill="#1E293B" stroke={outline} strokeWidth="1" />
        <circle cx="43" cy="38" r="3.2" fill={eyeColor} />
        {/* Reflets brillants */}
        <circle cx="41.5" cy="36" r="1.6" fill="#FFFFFF" />
        <circle cx="44.5" cy="40.5" r="0.8" fill="#FFFFFF" />
      </g>

      {/* Œil Droit */}
      <g>
        <ellipse cx="71" cy="38" rx="4.5" ry="5.5" fill="#1E293B" stroke={outline} strokeWidth="1" />
        <circle cx="71" cy="38" r="3.2" fill={eyeColor} />
        {/* Reflets brillants */}
        <circle cx="69.5" cy="36" r="1.6" fill="#FFFFFF" />
        <circle cx="72.5" cy="40.5" r="0.8" fill="#FFFFFF" />
      </g>

      {/* Joues rosées d'émoji */}
      <ellipse cx="36" cy="46" rx="5" ry="3.5" fill={blush} fillOpacity="0.45" />
      <ellipse cx="78" cy="46" rx="5" ry="3.5" fill={blush} fillOpacity="0.45" />

      {/* Petit nez mignon */}
      <circle cx="57" cy="43" r="1.2" fill={skinShadow} />

      {/* ========================================== */}
      {/* 7. TÉTINE / SUCETTE (PACIFIER)             */}
      {/* ========================================== */}
      <g transform="translate(57, 51)">
        {/* Bouclier ovale de la tétine */}
        <ellipse cx="0" cy="0" rx="10" ry="7.5" fill={paciBase} stroke={outline} strokeWidth="1.8" />
        {/* Trous d'aération */}
        <circle cx="-5.5" cy="0" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
        <circle cx="5.5" cy="0" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
        {/* Bouton central de la tétine */}
        <circle cx="0" cy="0" r="4.2" fill="#FFFFFF" stroke={outline} strokeWidth="1.2" />
        {/* Anneau / Poignée de la tétine */}
        <path d="M-4 2 C-4 7 4 7 4 2" stroke={paciRing} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
