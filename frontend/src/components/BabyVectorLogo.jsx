import React from 'react';

/**
 * BabyVectorLogo : Bébé mignon assis/à quatre pattes avec un corps potelé bien équilibré,
 * une grosse couche moelleuse, deux petits bras en avant, de jolis petits pieds,
 * une tétine, une mèche de cheveux bouclée et de grands yeux doux.
 */
export default function BabyVectorLogo({ 
  gender = 'boy', // 'boy' | 'girl'
  size = 72, 
  className = '' 
}) {
  const isGirl = gender === 'girl';

  // Couleurs fines et douces
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
      viewBox="0 0 110 115" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-sm transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <defs>
        {/* Dégradé doux peau */}
        <radialGradient id={`babySkinGrad2_${gender}`} cx="55" cy="38" r="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF4ED" />
          <stop offset="100%" stopColor="#FFE4D9" />
        </radialGradient>
      </defs>

      {/* ========================================== */}
      {/* 1. PETITS PIEDS POTELÉS GAUCHE & DROIT     */}
      {/* ========================================== */}
      {/* Pied Gauche potelé */}
      <g>
        <ellipse cx="27" cy="94" rx="10" ry="7" fill={skin} stroke={outline} strokeWidth="1.8" />
        {/* Petits orteils mignons */}
        <circle cx="21" cy="92" r="2.2" fill={skinShadow} />
        <circle cx="25" cy="90" r="1.8" fill={skinShadow} />
        <circle cx="29" cy="90" r="1.6" fill={skinShadow} />
      </g>

      {/* Pied Droit potelé */}
      <g>
        <ellipse cx="83" cy="94" rx="10" ry="7" fill={skin} stroke={outline} strokeWidth="1.8" />
        {/* Petits orteils mignons */}
        <circle cx="89" cy="92" r="2.2" fill={skinShadow} />
        <circle cx="85" cy="90" r="1.8" fill={skinShadow} />
        <circle cx="81" cy="90" r="1.6" fill={skinShadow} />
      </g>

      {/* ========================================== */}
      {/* 2. CORPS POTELÉ & GROSSE COUCHE CENTRÉE    */}
      {/* ========================================== */}
      {/* Petit ventre / Torse potelé */}
      <path 
        d="M36 56 C32 68 34 82 42 90 C50 94 60 94 68 90 C76 82 78 68 74 56 Z" 
        fill={skin} 
        stroke={outline} 
        strokeWidth="1.8" 
        strokeLinejoin="round" 
      />

      {/* Grosse Couche Blanche bien ronde et moelleuse */}
      <path 
        d="M32 76 C32 98 78 98 78 76 C78 72 32 72 32 76 Z" 
        fill={diaper} 
        stroke={outline} 
        strokeWidth="1.8" 
        strokeLinejoin="round" 
      />
      {/* Liseré / Ombrage doux de la couche */}
      <path 
        d="M36 82 C44 94 66 94 74 82" 
        stroke={diaperBorder} 
        strokeWidth="2.2" 
        strokeLinecap="round" 
      />
      {/* Attaches mignonnes de la couche */}
      <rect x="30" y="74" width="7" height="4" rx="2" fill={paciRing} stroke={outline} strokeWidth="1.2" />
      <rect x="73" y="74" width="7" height="4" rx="2" fill={paciRing} stroke={outline} strokeWidth="1.2" />

      {/* ========================================== */}
      {/* 3. DEUX PETITS BRAS EN AVANT               */}
      {/* ========================================== */}
      {/* Bras & Main Gauche */}
      <g>
        <path 
          d="M36 60 C32 68 32 78 35 84 C38 87 43 85 43 80 C43 74 44 66 44 60" 
          fill={skin} 
          stroke={outline} 
          strokeWidth="1.8" 
          strokeLinejoin="round" 
        />
        <circle cx="37" cy="84" r="3.2" fill={skin} stroke={outline} strokeWidth="1.4" />
      </g>

      {/* Bras & Main Droite */}
      <g>
        <path 
          d="M74 60 C78 68 78 78 75 84 C72 87 67 85 67 80 C67 74 66 66 66 60" 
          fill={skin} 
          stroke={outline} 
          strokeWidth="1.8" 
          strokeLinejoin="round" 
        />
        <circle cx="73" cy="84" r="3.2" fill={skin} stroke={outline} strokeWidth="1.4" />
      </g>

      {/* ========================================== */}
      {/* 4. TÊTE RONDE DE BÉBÉ                      */}
      {/* ========================================== */}
      <circle 
        cx="55" 
        cy="38" 
        r="27" 
        fill={`url(#babySkinGrad2_${gender})`} 
        stroke={outline} 
        strokeWidth="2" 
      />

      {/* Oreille Gauche */}
      <ellipse cx="27" cy="39" rx="4" ry="5.5" fill={skin} stroke={outline} strokeWidth="1.6" />
      <circle cx="27" cy="39" r="1.8" fill={skinShadow} />

      {/* Oreille Droite */}
      <ellipse cx="83" cy="39" rx="4" ry="5.5" fill={skin} stroke={outline} strokeWidth="1.6" />
      <circle cx="83" cy="39" r="1.8" fill={skinShadow} />

      {/* ========================================== */}
      {/* 5. MÈCHE DE CHEVEUX BOUCLÉE AU SOMMET      */}
      {/* ========================================== */}
      <path 
        d="M50 12 C48 6 56 2 58 6 C60 8 56 10 60 12" 
        stroke={hair} 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        fill={hair} 
      />
      <path 
        d="M54 12 C56 7 64 6 65 10 C66 12 60 12 60 13" 
        stroke={hair} 
        strokeWidth="1.8" 
        strokeLinecap="round" 
      />

      {/* ========================================== */}
      {/* 6. YEUX EXPRESSIFS & SOURCILS FINS         */}
      {/* ========================================== */}
      {/* Sourcils fins */}
      <path d="M40 27 Q46 24 50 27" stroke={hair} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M60 27 Q64 24 70 27" stroke={hair} strokeWidth="1.4" strokeLinecap="round" fill="none" />

      {/* Œil Gauche */}
      <g>
        <ellipse cx="45" cy="34" rx="4.5" ry="5.5" fill="#1E293B" stroke={outline} strokeWidth="1" />
        <circle cx="45" cy="34" r="3.2" fill={eyeColor} />
        {/* Reflets brillants */}
        <circle cx="43.5" cy="32" r="1.6" fill="#FFFFFF" />
        <circle cx="46.5" cy="36.5" r="0.8" fill="#FFFFFF" />
      </g>

      {/* Œil Droit */}
      <g>
        <ellipse cx="65" cy="34" rx="4.5" ry="5.5" fill="#1E293B" stroke={outline} strokeWidth="1" />
        <circle cx="65" cy="34" r="3.2" fill={eyeColor} />
        {/* Reflets brillants */}
        <circle cx="63.5" cy="32" r="1.6" fill="#FFFFFF" />
        <circle cx="66.5" cy="36.5" r="0.8" fill="#FFFFFF" />
      </g>

      {/* Joues rosées d'émoji */}
      <ellipse cx="36" cy="42" rx="5.5" ry="4" fill={blush} fillOpacity="0.45" />
      <ellipse cx="74" cy="42" rx="5.5" ry="4" fill={blush} fillOpacity="0.45" />

      {/* Petit nez mignon */}
      <circle cx="55" cy="39" r="1.2" fill={skinShadow} />

      {/* ========================================== */}
      {/* 7. TÉTINE / SUCETTE (PACIFIER)             */}
      {/* ========================================== */}
      <g transform="translate(55, 47)">
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
