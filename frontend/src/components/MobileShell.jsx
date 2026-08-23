import React from 'react';

export default function MobileShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center selection:bg-sun-200">
      <div className="w-full max-w-[440px] min-h-screen bg-gradient-to-b from-amber-50/80 via-yellow-50/40 to-emerald-50/50 flex flex-col shadow-2xl relative border-x border-sun-200/50 pb-20">
        {children}
      </div>
    </div>
  );
}
