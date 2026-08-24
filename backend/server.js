const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve frontend static build files (HTML is never cached so new builds show instantly)
app.use(express.static(path.join(__dirname, '../frontend/dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// 1. Settings
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const settings = db.updateSettings(req.body);
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PIN Code Verification & Change (1234)
app.post('/api/config/verify-pin', (req, res) => {
  try {
    const { pin } = req.body;
    const isValid = db.verifyParentPin(pin);
    if (!isValid) {
      return res.status(401).json({ success: false, error: "Code secret incorrect." });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/config/change-pin', (req, res) => {
  try {
    const { oldPin, newPin } = req.body;
    const result = db.changeParentPin(oldPin, newPin);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    res.json({ success: true, message: "Code secret modifié avec succès !" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Participants (Register once with photo & pseudo)
app.get('/api/participants', (req, res) => {
  try {
    const participants = db.getParticipants();
    res.json({ success: true, participants });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/participants', (req, res) => {
  try {
    const participants = db.addOrUpdateParticipant(req.body);
    res.json({ success: true, participants });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/participants/:id/photo', (req, res) => {
  try {
    const { photo } = req.body;
    const participants = db.updateParticipantPhoto(req.params.id, photo);
    res.json({ success: true, participants });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/participants/:id', (req, res) => {
  try {
    const participants = db.deleteParticipant(req.params.id);
    res.json({ success: true, participants });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Predictions
app.get('/api/predictions', (req, res) => {
  try {
    const data = db.getPredictions();
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/predictions', (req, res) => {
  try {
    const { author, photo, date, time, firstName, weight, height, eyeColor, hairColor, resemblance, message } = req.body;
    if (!author || !date || !time) {
      return res.status(400).json({ success: false, error: "Auteur, date et heure requis." });
    }
    const data = db.addPrediction({ author, photo, date, time, firstName, weight, height, eyeColor, hairColor, resemblance, message });
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/predictions/birth', (req, res) => {
  try {
    const data = db.setActualBirth(req.body);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/predictions/reset', (req, res) => {
  try {
    const data = db.resetBirthStatus();
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Polls / Hésitations
app.get('/api/polls', (req, res) => {
  try {
    const polls = db.getPolls();
    res.json({ success: true, polls });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/polls', (req, res) => {
  try {
    const { question, options } = req.body;
    if (!question || !options || options.length < 2) {
      return res.status(400).json({ success: false, error: "Question et au moins 2 options requises." });
    }
    const polls = db.addPoll({ question, options });
    res.json({ success: true, polls });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/polls/:id/vote', (req, res) => {
  try {
    const { optionIndex, voterName } = req.body;
    if (optionIndex === undefined || !voterName) {
      return res.status(400).json({ success: false, error: "Index de l'option et nom du votant requis." });
    }
    const polls = db.votePoll(req.params.id, Number(optionIndex), voterName);
    res.json({ success: true, polls });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/polls/:id', (req, res) => {
  try {
    const polls = db.deletePoll(req.params.id);
    res.json({ success: true, polls });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Messages / Livre d'Or
app.get('/api/messages', (req, res) => {
  try {
    const messages = db.getMessages();
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/messages', (req, res) => {
  try {
    const { author, text, emoji } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: "Le message ne peut pas être vide." });
    }
    const messages = db.addMessage({ author, text, emoji });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/messages/:id', (req, res) => {
  try {
    const messages = db.deleteMessage(req.params.id);
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Purchases & Categories
app.get('/api/purchases', (req, res) => {
  try {
    const data = db.getPurchasesData();
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/purchases', (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) return res.status(400).json({ success: false, error: "Titre requis" });
    const data = db.addPurchaseItem({ title, category });
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/purchases/categories', (req, res) => {
  try {
    const { category } = req.body;
    if (!category) return res.status(400).json({ success: false, error: "Nom de catégorie requis" });
    const data = db.addPurchaseCategory(category);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/purchases/categories/:category', (req, res) => {
  try {
    const data = db.deletePurchaseCategory(decodeURIComponent(req.params.category));
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/purchases/:id/toggle', (req, res) => {
  try {
    const data = db.togglePurchaseItem(req.params.id);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/purchases/:id', (req, res) => {
  try {
    const data = db.deletePurchaseItem(req.params.id);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Maternity Bag
app.get('/api/maternity-bag', (req, res) => {
  try {
    const items = db.getMaternityBag();
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/maternity-bag', (req, res) => {
  try {
    const { title, forWho } = req.body;
    if (!title) return res.status(400).json({ success: false, error: "Titre requis" });
    const items = db.addMaternityBagItem({ title, forWho });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/maternity-bag/:id/toggle', (req, res) => {
  try {
    const items = db.toggleMaternityBagItem(req.params.id);
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/maternity-bag/:id', (req, res) => {
  try {
    const items = db.deleteMaternityBagItem(req.params.id);
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Appointments
app.get('/api/appointments', (req, res) => {
  try {
    const items = db.getAppointments();
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/appointments', (req, res) => {
  try {
    const items = db.addAppointment(req.body);
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/appointments/:id/toggle', (req, res) => {
  try {
    const items = db.toggleAppointment(req.params.id);
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/appointments/:id', (req, res) => {
  try {
    const items = db.deleteAppointment(req.params.id);
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Mots Croisés & Fléchés Quotidiens (12 mots)
app.get('/api/crosswords/daily', (req, res) => {
  try {
    const grid = db.getDailyCrosswordGrid(req.query.date);
    const leaderboards = db.getCrosswordLeaderboards(req.query.date);
    res.json({ success: true, grid, ...leaderboards });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/crosswords/leaderboard', (req, res) => {
  try {
    const leaderboards = db.getCrosswordLeaderboards(req.query.date);
    res.json({ success: true, ...leaderboards });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/crosswords/submit', (req, res) => {
  try {
    const { playerName, timeSeconds, timeFormatted, correctCount, totalWords, theme, date } = req.body;
    if (!playerName) {
      return res.status(400).json({ success: false, error: "Nom du joueur requis." });
    }
    const result = db.submitCrosswordScore({
      playerName,
      timeSeconds,
      timeFormatted,
      correctCount,
      totalWords,
      theme,
      date
    });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Quiz Duel Alizée vs Lucas (50 Questions & Résultats par Catégorie)
app.get('/api/quiz/questions', (req, res) => {
  try {
    const questions = db.getQuizQuestions();
    res.json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/quiz/results', (req, res) => {
  try {
    const aggregates = db.getQuizAggregates();
    res.json({ success: true, ...aggregates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/quiz/vote', (req, res) => {
  try {
    const { questionId, voter, choice } = req.body;
    if (!questionId || !choice) {
      return res.status(400).json({ success: false, error: "Données de vote manquantes." });
    }
    const updated = db.addQuizVote({
      questionId: Number(questionId),
      voter: voter || "Anonyme",
      choice // "Alizée" or "Lucas"
    });
    res.json({ success: true, ...updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/quiz/votes/:voter', (req, res) => {
  try {
    const data = db.readDb ? db.readDb() : {};
    if (data.quizVotes) {
      data.quizVotes = data.quizVotes.filter(v => (v.voter || '').toLowerCase() !== (req.params.voter || '').toLowerCase());
      db.writeDb && db.writeDb(data);
    }
    res.json({ success: true, ...db.getQuizAggregates() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// SPA Fallback
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🦁 Serveur Bébé Garçon démarré sur http://localhost:${PORT}`);
});
