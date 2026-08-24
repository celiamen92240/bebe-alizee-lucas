import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import MobileShell from './components/MobileShell';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import UserProfileModal from './components/UserProfileModal';
import { UserProvider, useUser } from './context/UserContext';
import HomeView from './views/HomeView';
import PredictionsView from './views/PredictionsView';
import QuizView from './views/QuizView';
import DailyGameView from './views/DailyGameView';
import PollsView from './views/PollsView';
import ParentsSpaceView from './views/ParentsSpaceView';
import GuestbookView from './views/GuestbookView';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isBorn, setIsBorn] = useState(false);
  const [actualBirth, setActualBirth] = useState(null);
  const { isRegisterModalOpen, setIsRegisterModalOpen, currentUser } = useUser();

  const checkBirthStatus = () => {
    fetch('/api/predictions')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsBorn(!!data.isBorn);
          setActualBirth(data.actualBirth || null);
        }
      })
      .catch(err => console.error("Error checking birth status", err));
  };

  useEffect(() => {
    checkBirthStatus();
  }, []);

  return (
    <MobileShell>
      {/* Header */}
      <Header
        onAdminClick={() => setCurrentTab('parents')}
        isBorn={isBorn}
      />

      {/* Main Tab Content */}
      <div className="pt-2">
        {currentTab === 'home' && (
          <HomeView
            setTab={setCurrentTab}
            isBorn={isBorn}
            actualBirth={actualBirth}
          />
        )}

        {currentTab === 'predictions' && (
          <PredictionsView
            isBorn={isBorn}
            actualBirth={actualBirth}
            onOpenAdmin={() => setCurrentTab('parents')}
          />
        )}

        {currentTab === 'quiz' && (
          <QuizView />
        )}

        {currentTab === 'games' && (
          <DailyGameView />
        )}

        {currentTab === 'polls' && (
          <PollsView />
        )}

        {currentTab === 'parents' && (
          <ParentsSpaceView
            isBorn={isBorn}
            actualBirth={actualBirth}
            onBirthSaved={(birthData) => {
              setIsBorn(true);
              setActualBirth(birthData);
            }}
            onResetBirth={() => {
              setIsBorn(false);
              setActualBirth(null);
            }}
          />
        )}

        {currentTab === 'guestbook' && (
          <GuestbookView />
        )}
      </div>

      {/* Footer Signature */}
      <footer className="text-center py-5 pb-24 space-y-1">
        <p className="font-serif text-xs font-black text-[#5D372A] tracking-wide flex items-center justify-center gap-1.5 flex-wrap">
          <Sparkles className="w-3.5 h-3.5 text-[#EA672D] fill-[#FFEEBC]" />
          <span>Pour les meilleurs futurs parents, Alizée & Lucas</span>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-lg bg-[#C5D88F]/30 border border-[#C5D88F]/60 text-[#1E4E42] shadow-2xs">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M22 10c0-3.31-2.69-6-6-6h-3c-1.1 0-2 .9-2 2v2H7c-2.76 0-5 2.24-5 5v2c0 .55.45 1 1 1h1v4c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-4h6v4c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-5.08c2.28-.46 4-2.48 4-4.92zm-8-3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
            </svg>
          </span>
          <Heart className="w-3.5 h-3.5 text-[#D26E7B] fill-[#D26E7B]" />
        </p>
        <p className="text-[10px] text-slate-400 font-medium">
          En attendant le plus beau des jours J
        </p>
      </footer>

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setTab={setCurrentTab}
      />

      {/* Single Registration / Profile Modal */}
      <UserProfileModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        required={!currentUser}
      />
    </MobileShell>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
