import React, { useState, useEffect } from 'react';
import { Heart, Send, Sparkles, Trash2, Smile, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser } from '../context/UserContext';
import ParticipantSelector from '../components/ParticipantSelector';

export default function GuestbookView() {
  const { currentUser, setIsRegisterModalOpen } = useUser();
  const [messages, setMessages] = useState([]);
  const [author, setAuthor] = useState(currentUser?.name || '');
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState('💛');

  const emojisList = ['💛', '🦁', '👑', '🍼', '✨', '🥰', '👶', '🧸', '⭐', '🎈'];

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.success) setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (currentUser?.name) setAuthor(currentUser.name);
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: author.trim(), text: text.trim(), emoji })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        setText('');
        confetti({ particleCount: 60, spread: 70, colors: ['#facc15', '#4ade80', '#eab308'] });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce mot doux ?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-5 space-y-5 pb-8">
      {/* Header Banner */}
      <div className="glass-card-sun rounded-3xl p-5 border border-sun-300 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sun-800 bg-white/80 px-2.5 py-0.5 rounded-full border border-sun-200">
              Livre d'Or & Souvenirs
            </span>
            <h2 className="font-serif text-xl font-extrabold text-slate-800">
              Capsule d'Amour
            </h2>
            <p className="text-xs text-amber-800 font-medium">
              Laissez un message plein de tendresse pour Alizée, Lucas & leur petit prince 🦕 !
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#ECCEE6] flex items-center justify-center shadow-2xs relative flex-shrink-0">
            <Mail className="w-6 h-6 text-[#D26E7B] stroke-[2.2px]" />
            <Heart className="w-3 h-3 text-[#D26E7B] fill-[#D26E7B] absolute top-1.5 right-1.5 drop-shadow-2xs animate-pulse" />
          </div>
        </div>
      </div>

      {/* Message Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 shadow-sm border border-sun-200 space-y-3.5">
        <ParticipantSelector
          selectedName={author}
          onSelect={(name) => setAuthor(name)}
          label="De la part de :"
        />

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Ton mot doux / vœu :</label>
          <textarea
            rows={3}
            required
            placeholder="Écris ton mot plein d'amour pour le bébé et les parents..."
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full p-3 rounded-2xl border border-sun-200 text-xs font-medium text-slate-800 bg-amber-50/20 outline-none focus:ring-2 focus:ring-sun-400"
          />
        </div>

        {/* Emojis Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {emojisList.map(em => (
            <button
              key={em}
              type="button"
              onClick={() => setEmoji(em)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all cursor-pointer ${
                emoji === em ? 'bg-sun-200 ring-2 ring-sun-400 scale-110' : 'bg-slate-50 hover:bg-sun-100'
              }`}
            >
              {em}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-sun-500 to-mint-600 hover:from-sun-600 hover:to-mint-700 text-white font-bold py-3 rounded-2xl shadow-md text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span>Glisser mon mot dans la capsule</span>
        </button>
      </form>

      {/* Messages Feed */}
      <div className="space-y-3">
        <h3 className="font-serif text-sm font-bold text-slate-800 px-1">
          Mots d'amour de la famille ({messages.length})
        </h3>

        {messages.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-sun-200 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-2xs relative mx-auto">
              <Mail className="w-6 h-6 text-[#D26E7B] stroke-[2.2px]" />
              <Heart className="w-3 h-3 text-[#D26E7B] fill-[#D26E7B] absolute top-1.5 right-1.5 drop-shadow-2xs" />
            </div>
            <p className="text-xs font-bold text-slate-700">La capsule est encore vide</p>
            <p className="text-[11px] text-slate-400">Écris le tout premier mot doux pour le bébé !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl p-4 shadow-2xs border border-sun-200/90 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{m.emoji || '💛'}</span>
                    <div>
                      <p className="text-xs font-black text-slate-800">{m.author}</p>
                      <p className="text-[9px] text-slate-400">
                        {m.createdAt ? new Date(m.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    className="text-slate-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs font-handwriting text-base font-bold text-amber-950 bg-amber-50/40 p-3 rounded-2xl border border-sun-100/60 leading-relaxed">
                  « {m.text} »
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
