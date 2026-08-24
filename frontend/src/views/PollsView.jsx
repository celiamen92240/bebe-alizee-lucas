import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, Check, Trash2, Sparkles, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser } from '../context/UserContext';
import ParticipantSelector from '../components/ParticipantSelector';

export default function PollsView() {
  const { currentUser, setIsRegisterModalOpen } = useUser();
  const [polls, setPolls] = useState([]);
  const [showNewPoll, setShowNewPoll] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '']);

  const fetchPolls = async () => {
    try {
      const res = await fetch('/api/polls');
      const data = await res.json();
      if (data.success) setPolls(data.polls || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    const voter = currentUser?.name;
    if (!voter) {
      setIsRegisterModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIndex, voterName: voter })
      });
      const data = await res.json();
      if (data.success) {
        setPolls(data.polls);
        confetti({ particleCount: 35, spread: 50, colors: ['#facc15', '#4ade80', '#22c55e'] });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm("Supprimer ce dilemme ?")) return;
    try {
      const res = await fetch(`/api/polls/${pollId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setPolls(data.polls);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const validOptions = newOptions.map(o => o.trim()).filter(Boolean);
    if (!newQuestion.trim() || validOptions.length < 2) return;

    try {
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQuestion.trim(), options: validOptions })
      });
      const data = await res.json();
      if (data.success) {
        setPolls(data.polls);
        setShowNewPoll(false);
        setNewQuestion('');
        setNewOptions(['', '']);
      }
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
              Avis & Conseils de la Famille
            </span>
            <h2 className="font-serif text-xl font-extrabold text-slate-800">
              Hésitations & Dilemmes
            </h2>
            <p className="text-xs text-amber-800 font-medium">
              Aidez Alizée & Lucas à trancher sur les choix pour leur petit garçon !
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/90 border border-sun-200 flex items-center justify-center shadow-2xs text-amber-500 flex-shrink-0">
            <Lightbulb className="w-6 h-6 fill-amber-300" />
          </div>
        </div>
      </div>

      {/* Button to add new poll */}
      {!showNewPoll && (
        <button
          type="button"
          onClick={() => setShowNewPoll(true)}
          className="w-full bg-white hover:bg-amber-50/50 text-sun-800 font-bold py-3 rounded-2xl border border-sun-300 shadow-xs text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4 text-sun-600" />
          <span>Proposer une nouvelle question / dilemme</span>
        </button>
      )}

      {/* Add Poll Form */}
      {showNewPoll && (
        <form onSubmit={handleCreatePoll} className="bg-white rounded-3xl p-5 shadow-lg border-2 border-sun-300 space-y-3.5 animate-in zoom-in-95">
          <div className="flex justify-between items-center border-b border-sun-100 pb-2">
            <h3 className="font-serif text-xs font-bold text-slate-800">Nouveau Dilemme</h3>
            <button type="button" onClick={() => setShowNewPoll(false)} className="text-xs text-slate-400">✕</button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">La Question :</label>
            <input
              type="text"
              required
              placeholder="Ex: Thème du premier anniversaire ?"
              value={newQuestion}
              onChange={e => setNewQuestion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-sun-200 text-xs bg-amber-50/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Options de choix :</label>
            {newOptions.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                required
                placeholder={`Option ${idx + 1}...`}
                value={opt}
                onChange={e => {
                  const arr = [...newOptions];
                  arr[idx] = e.target.value;
                  setNewOptions(arr);
                }}
                className="w-full px-3 py-2 rounded-xl border border-sun-200 text-xs bg-amber-50/20"
              />
            ))}
            <button
              type="button"
              onClick={() => setNewOptions([...newOptions, ''])}
              className="text-[11px] text-sun-700 font-bold hover:underline block"
            >
              + Ajouter une autre option
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-sun-500 hover:bg-sun-600 text-white font-bold py-3 rounded-xl shadow text-xs"
          >
            Publier le sondage ✨
          </button>
        </form>
      )}

      {/* Polls Feed */}
      <div className="space-y-4">
        {polls.map((poll) => {
          const totalVotes = (poll.options || []).reduce((acc, o) => acc + (o.votes || 0), 0);
          const userVote = poll.votes?.find(v => v.voterName?.toLowerCase() === currentUser?.name?.toLowerCase());

          return (
            <div
              key={poll.id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-sun-200/90 space-y-3.5 relative"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-serif text-sm font-extrabold text-slate-800 leading-snug">
                  « {poll.question} »
                </h4>
                <button
                  type="button"
                  onClick={() => handleDeletePoll(poll.id)}
                  className="text-slate-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                  title="Supprimer ce sondage"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {poll.options.map((opt, optIdx) => {
                  const isUserPick = userVote?.optionIndex === optIdx;
                  const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleVote(poll.id, optIdx)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                        isUserPick
                          ? 'bg-amber-50/80 border-sun-400 ring-2 ring-sun-200'
                          : 'bg-slate-50/60 border-slate-200 hover:border-sun-300'
                      }`}
                    >
                      {/* Percent Fill Background */}
                      <div
                        className="absolute inset-y-0 left-0 bg-sun-200/30 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>

                      <div className="relative flex items-center justify-between z-10 text-xs font-bold text-slate-800">
                        <span className="flex items-center gap-2">
                          {isUserPick && <Check className="w-3.5 h-3.5 text-sun-600 stroke-[3px]" />}
                          <span>{opt.text}</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 font-bold">
                          {pct}% ({opt.votes})
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium px-1">
                <span>{totalVotes} vote{totalVotes > 1 ? 's' : ''} au total</span>
                {userVote && <span className="text-sun-700 font-bold">✓ Tu as voté</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
