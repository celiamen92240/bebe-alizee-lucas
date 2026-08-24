import React from 'react';
import { Home, Target, HelpCircle, Gamepad2, Lightbulb, Lock } from 'lucide-react';

export default function BottomNav({ currentTab, setTab }) {
  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'predictions', label: 'Pronos', icon: Target },
    { id: 'quiz', label: 'Quizz', icon: HelpCircle },
    { id: 'games', label: 'Jeux', icon: Gamepad2 },
    { id: 'polls', label: 'Idées', icon: Lightbulb },
    { id: 'parents', label: 'Parents', icon: Lock }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto bg-white/95 backdrop-blur-xl border-t-2 border-[#EFE89F] px-1 py-2 z-50 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all relative cursor-pointer ${
                isActive
                  ? 'text-[#D26E7B] font-black scale-105'
                  : 'text-slate-400 hover:text-[#92AFEC] font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 w-7 h-1.5 bg-gradient-to-r from-[#D26E7B] via-[#EFE89F] to-[#92AFEC] rounded-full shadow-xs"></span>
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.8px] text-[#D26E7B]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-1 tracking-tight font-bold">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
