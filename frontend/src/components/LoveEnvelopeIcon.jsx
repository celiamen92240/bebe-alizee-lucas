import React from 'react';

/**
 * LoveEnvelopeIcon : Enveloppe ouverte avec petit cœur rose délicatement posé à la fente
 * (à peine sorti de l'enveloppe, doux, poétique et soigné).
 */
export default function LoveEnvelopeIcon({ size = 28, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-xs ${className}`}
    >
      {/* 1. Rabat arrière ouvert de l'enveloppe */}
      <path 
        d="M4 14.5 L16 6.5 L28 14.5" 
        stroke="#D26E7B" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="#FFF5F5" 
      />
      
      {/* 2. Petite carte / lettre à l'intérieur */}
      <rect 
        x="7.5" 
        y="9.5" 
        width="17" 
        height="12" 
        rx="2" 
        fill="#FFFFFF" 
        stroke="#FCD8E6" 
        strokeWidth="1.2" 
      />
      
      {/* Lignes de texte subtiles sur la lettre */}
      <line x1="11" y1="17.5" x2="21" y2="17.5" stroke="#FEEFF4" strokeWidth="1.2" strokeLinecap="round" />

      {/* 3. Petit Cœur Rose délicatement placé à la fente (à peine sorti) */}
      <path 
        d="M16 14 C16 14 13.2 11.2 13.2 9.5 C13.2 8.3 14.1 7.4 15.2 7.4 C15.8 7.4 16 7.8 16 7.8 C16 7.8 16.2 7.4 16.8 7.4 C17.9 7.4 18.8 8.3 18.8 9.5 C18.8 11.2 16 14 16 14 Z" 
        fill="#FB7185" 
        stroke="#881337" 
        strokeWidth="1" 
        strokeLinejoin="round"
      />
      
      {/* 4. Corps avant de l'enveloppe (poche) */}
      <path 
        d="M4 13.5 V25 C4 26.1 4.9 27 6 27 H26 C27.1 27 28 26.1 28 25 V13.5 L16 21 L4 13.5 Z" 
        fill="#FFF0F5" 
        stroke="#D26E7B" 
        strokeWidth="1.8" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
