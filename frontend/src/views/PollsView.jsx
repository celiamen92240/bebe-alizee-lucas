import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, Check, Trash2, Sparkles, Lock, X, Users, PlusCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import ParticipantSelector from '../components/ParticipantSelector';

const EMOJI_PRESETS = ['🌿', '✨', '🧸', '🍼', '🦖', '💙', '⭐', '🎨', '🌙', '👕', '👑', '🚀'];

export default function PollsView() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voterName, setVoterName] = useState(localStorage.getItem('saved_voter_name_boy') || '');
  const [showAddModal, setShowAddModal] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [codeError, setCodeError] = useState('');

  // Form to add a new dilemma / poll
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Décoration 🎨');
  const [newDesc, setNewDesc] = useState('');
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [option1, setOption1] = useState('');
  const [option1Emoji, setOption1Emoji] = useState('🌿');
  const [option2, setOption2] = useState('');
  const [option2Emoji, setOption2Emoji] = useState('✨');
  const [option3, setOption3] = useState('');
  const [option3Emoji, setOption3Emoji] = useState('🧸');

  const fetchPolls = () => {
    fetch('/api/polls')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPolls(data.polls || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading polls", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleSelectVoter = (name) => {
    setVoterName(name);
    if (name) {
      localStorage.setItem('saved_voter_name_boy', name);
    }
  };

  const handleDeletePoll = async (pollId, pollTitle) => {
    if (!window.confirm(`Supprimer l'hésitation « ${pollTitle} » ?`)) return;

    try {
      const res = await fetch(`/api/polls/${pollId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPolls(data.polls || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVote = async (pollId, optionId) => {
    if (!voterName) {
      alert("Merci de sélectionner qui participe au vote ci-dessus !");
      return;
    }

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#818cf8', '#34d399', '#fde047']
    });

    try {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optionIndex: optionId,
          voterName
        })
      });
      const data = await res.json();
      if (data.success) {
        setPolls(data.polls || []);
      }
    } catch (err) {
      console.error("Error voting on poll", err);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !option1.trim() || !option2.trim()) return;

    const options = [
      { label: option1.trim(), emoji: option1Emoji },
      { label: option2.trim(), emoji: option2Emoji }
    ];
    if (option3.trim()) {
      options.push({ label: option3.trim(), emoji: option3Emoji });
    }

    try {
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          description: newDesc.trim(),
          multiple: isMultipleChoice,
          options,
          secretCode
        })
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setPolls(data.polls || []);
        setShowAddModal(false);
        setNewTitle('');
        setNewDesc('');
        setOption1('');
        setOption2('');
        setOption3('');
        setSecretCode('');
        setIsMultipleChoice(false);
        setCodeError('');
      } else {
        setCodeError(data.error || "Code d'accès incorrect");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-5 space-y-5 pb-8">
      {/* Header Banner */}
      <div className="glass-card-sun rounded-3xl p-5 border border-[#C5D88F] shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2d6a4f]">
              Sondages & Idées • Aidez les Parents !
            </span>
            <h2 className="font-serif text-xl font-extrabold text-[#1E4E42] flex items-center gap-2">
              <span>Hésitations & Dilemmes</span>
              <div className="w-7 h-7 rounded-xl bg-white text-amber-500 flex items-center justify-center shadow-2xs border border-amber-200">
                <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-300" />
              </div>
            </h2>
            <p className="text-xs text-[#1E4E42]/80 font-medium">
              Votez sur leurs choix de déco, achats, tenues et préparatifs !
            </p>
          </div>
        </div>
      </div>

      {/* SÉLECTION DU PARTICIPANT */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-[#EFE89F] space-y-2">
        <ParticipantSelector
          selectedName={voterName}
          onSelect={(name) => handleSelectVoter(name)}
          label="Qui vote aujourd'hui ?"
        />
      </div>

      {/* Button to add a dilemma (for Parents) */}
      <button
        onClick={() => {
          setShowAddModal(true);
          setCodeError('');
        }}
        className="w-full bg-white hover:bg-emerald-50/60 text-[#1E4E42] font-bold py-3 px-4 rounded-2xl shadow-xs border border-[#C5D88F] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
      >
        <Lock className="w-3.5 h-3.5 text-[#2d6a4f]" />
        <span>Créer une hésitation (Réservé aux parents)</span>
        <PlusCircle className="w-4 h-4 text-[#2d6a4f]" />
      </button>

      {/* LIST OF POLLS */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin w-8 h-8 border-3 border-[#2d6a4f] border-t-transparent rounded-full mx-auto" />
          <p className="text-xs text-slate-400 mt-2 font-medium">Chargement des sondages...</p>
        </div>
      ) : polls.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center space-y-3 border-2 border-dashed border-[#C5D88F]">
          <span className="text-4xl block">💡</span>
          <h3 className="font-serif text-base font-bold text-slate-700">Aucun dilemme pour le moment</h3>
          <p className="text-xs text-slate-400">
            Alizée et Lucas n'ont pas encore posté d'hésitations. Revenez bientôt !
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {polls.map((poll) => {
            const hasVotedAny = voterName && (poll.options || []).some(o => (o.voters || []).includes(voterName));

            return (
              <div
                key={poll.id}
                className="bg-white rounded-3xl p-5 shadow-sm border-2 border-[#EFE89F] hover:border-[#C5D88F] transition-all space-y-4 relative overflow-hidden"
              >
                {/* Header of Poll */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#1E4E42] bg-[#EFE89F] px-2.5 py-0.5 rounded-full border border-[#C5D88F]">
                        {poll.category || "Hésitation"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{poll.totalParticipants || 0} participant{(poll.totalParticipants || 0) > 1 ? 's' : ''}</span>
                      </span>
                      {poll.multiple && (
                        <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                          Choix multiple
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-base font-black text-slate-800 leading-snug">
                      {poll.title || poll.question}
                    </h3>
                    {poll.description && (
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {poll.description}
                      </p>
                    )}
                  </div>

                  {/* Bouton de suppression parent discret */}
                  <button
                    onClick={() => handleDeletePoll(poll.id, poll.title || poll.question)}
                    className="text-slate-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Supprimer cette hésitation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {(poll.options || []).map((opt) => {
                    const isOptionChecked = voterName && (opt.voters || []).includes(voterName);

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleVote(poll.id, opt.id)}
                        className={`w-full relative overflow-hidden rounded-2xl border-2 p-3 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isOptionChecked
                            ? 'border-[#2d6a4f] bg-emerald-50/50 shadow-xs scale-[1.01]'
                            : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-200'
                        }`}
                      >
                        {/* Progress Bar Background */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 transition-all duration-700 pointer-events-none rounded-xl ${
                            isOptionChecked
                              ? 'bg-gradient-to-r from-[#C5D88F]/50 to-[#EFE89F]/50'
                              : 'bg-slate-200/40'
                          }`}
                          style={{ width: `${opt.percent || 0}%` }}
                        />

                        {/* Content */}
                        <div className="relative z-10 flex items-center gap-2.5 flex-1 min-w-0">
                          {/* Checked Bubble */}
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            isOptionChecked
                              ? 'bg-[#2d6a4f] border-[#1E4E42] text-white shadow-2xs'
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isOptionChecked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                          </div>

                          <span className="text-xl flex-shrink-0">{opt.emoji || '🌿'}</span>
                          <span className={`text-xs font-black truncate ${
                            isOptionChecked ? 'text-[#1E4E42] font-extrabold' : 'text-slate-700'
                          }`}>
                            {opt.label || opt.text}
                          </span>
                        </div>

                        {/* Pourcentage de vote unique */}
                        <div className="relative z-10 flex items-center gap-1.5 flex-shrink-0">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                            isOptionChecked
                              ? 'bg-[#2d6a4f] text-white shadow-2xs'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}>
                            {opt.percent || 0}%
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 px-1">
                  <span>
                    {hasVotedAny
                      ? '✨ Votre vote est comptabilisé (cliquez pour modifier/annuler)'
                      : '👉 Touchez une option pour voter'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL AJOUT D'HÉSITATION (CODE PARENT REQUIS) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-[#C5D88F] space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#2d6a4f]">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base font-bold text-slate-800">
                  Créer un dilemme
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Question / Titre du dilemme *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Quelle couleur pour le mur de la chambre ?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#C5D88F] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#C5D88F] text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="Décoration 🎨">Décoration 🎨</option>
                  <option value="Achats & Puériculture 🛍️">Achats & Puériculture 🛍️</option>
                  <option value="Tenues & Dressing 👕">Tenues & Dressing 👕</option>
                  <option value="Prénom & Surnoms 🌿">Prénom & Surnoms 🌿</option>
                  <option value="Autre hésitation 💡">Autre hésitation 💡</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Précisions / Détails (optionnel)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex : On hésite entre deux ambiances douces..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#C5D88F] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>

              {/* Toggle Choix Unique vs Choix Multiple */}
              <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  Type de vote pour les proches :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMultipleChoice(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      !isMultipleChoice
                        ? 'bg-[#2d6a4f] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Choix unique
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMultipleChoice(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isMultipleChoice
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Choix multiple
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-700">
                  Choix proposés (au moins 2) :
                </label>

                {/* Option 1 */}
                <div className="flex items-center gap-1.5">
                  <select
                    value={option1Emoji}
                    onChange={(e) => setOption1Emoji(e.target.value)}
                    className="w-12 h-9 rounded-xl border border-[#C5D88F] text-sm bg-white text-center"
                  >
                    {EMOJI_PRESETS.map(em => <option key={em} value={em}>{em}</option>)}
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Option 1 *"
                    value={option1}
                    onChange={(e) => setOption1(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#C5D88F] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Option 2 */}
                <div className="flex items-center gap-1.5">
                  <select
                    value={option2Emoji}
                    onChange={(e) => setOption2Emoji(e.target.value)}
                    className="w-12 h-9 rounded-xl border border-[#C5D88F] text-sm bg-white text-center"
                  >
                    {EMOJI_PRESETS.map(em => <option key={em} value={em}>{em}</option>)}
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Option 2 *"
                    value={option2}
                    onChange={(e) => setOption2(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#C5D88F] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Option 3 */}
                <div className="flex items-center gap-1.5">
                  <select
                    value={option3Emoji}
                    onChange={(e) => setOption3Emoji(e.target.value)}
                    className="w-12 h-9 rounded-xl border border-[#C5D88F] text-sm bg-white text-center"
                  >
                    {EMOJI_PRESETS.map(em => <option key={em} value={em}>{em}</option>)}
                  </select>
                  <input
                    type="text"
                    placeholder="Option 3 (facultatif)"
                    value={option3}
                    onChange={(e) => setOption3(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#C5D88F] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* Code secret parents */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#2d6a4f]" />
                  <span>Code secret des parents *</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Code à 4 chiffres"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                {codeError && (
                  <p className="text-[10px] text-red-500 font-bold">{codeError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#2d6a4f] to-emerald-600 text-white font-bold py-3 rounded-xl shadow-md text-xs transition-all cursor-pointer"
              >
                Publier le dilemme ✨
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
