const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'database.json');

const defaultState = {
  settings: {
    title: "Bébé d'Amour 🦕",
    subtitle: "Alizée & Lucas • En attendant l'arrivée de notre petit garçon",
    parent1Name: "Alizée",
    parent2Name: "Lucas",
    babyGender: "boy", // boy
    dueDate: "2026-12-08", // Terme
    customHeaderPhoto: null,
    isBorn: false,
    actualBirth: null
  },
  participants: [],
  predictions: [],
  polls: [
    {
      id: "poll-1",
      question: "Quelle ambiance de chambre pour notre petit prince ?",
      options: [
        { text: "Dinosaures mignons & Aventure (🦕 🌴)", votes: 0 },
        { text: "Jungle & Savane (🦁 Girafes, Lions)", votes: 0 },
        { text: "Forêt enchantée & Renards (🦊 🌲)", votes: 0 },
        { text: "Nuages, Ciel & Étoiles (☁️ ⭐)", votes: 0 }
      ],
      votes: []
    },
    {
      id: "poll-2",
      question: "Qui se lèvera le plus la nuit pour les biberons ?",
      options: [
        { text: "Alizée (la force tranquille 👩)", votes: 0 },
        { text: "Lucas (le super héros des nuits 👨)", votes: 0 },
        { text: "50/50 à tour de rôle équitable ⚖️", votes: 0 }
      ],
      votes: []
    }
  ],
  purchasesCategories: [
    "Indispensables 🌟",
    "Chambre & Dodo 🛏️",
    "Poussette & Sorties 🚗",
    "Bain & Soins 🛁",
    "Vêtements 👗",
    "Repas & Biberons 🍼"
  ],
  purchasesList: [
    { id: "p-1", title: "Poussette tout-terrain + Cosy", category: "Poussette & Sorties 🚗", completed: false },
    { id: "p-2", title: "Lit bébé à barreaux + Matelas bio", category: "Chambre & Dodo 🛏️", completed: false },
    { id: "p-3", title: "Baignoire ergonomique & thermomètre", category: "Bain & Soins 🛁", completed: false },
    { id: "p-4", title: "Lot de 6 bodies en coton bio", category: "Vêtements 👗", completed: false }
  ],
  maternityBag: [
    { id: "mb-1", title: "3 pyjamas velours & bonnets de naissance", forWho: "baby", completed: false },
    { id: "mb-2", title: "Doudou réconfortant 🦕", forWho: "baby", completed: false },
    { id: "mb-3", title: "Gigoteuse naissance 0-1 mois", forWho: "baby", completed: false },
    { id: "mb-4", title: "Tenue de sortie confortable", forWho: "alizee", completed: false },
    { id: "mb-5", title: "Trousse de toilette & brumisateur", forWho: "alizee", completed: false },
    { id: "mb-6", title: "Enceinte bluetooth pour musique douce", forWho: "lucas", completed: false },
    { id: "mb-7", title: "Monnaie & collations pour la salle de naissance", forWho: "lucas", completed: false }
  ],
  appointments: [
    {
      id: "rdv-1",
      title: "Échographie T3 (Dernière rencontre visuelle)",
      date: "2026-10-15",
      time: "10:30",
      location: "Cabinet d'échographie",
      notes: "Vérifier la croissance de notre petit bonhomme !",
      completed: false
    }
  ],
  dailyGameScores: [],
  messages: []
};

// Ensure data folder exists
function initDb() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2), 'utf-8');
  }
}

function readDb() {
  initDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.settings) parsed.settings = defaultState.settings;
    if (!parsed.participants) parsed.participants = defaultState.participants;
    if (!parsed.polls) parsed.polls = defaultState.polls;
    if (!parsed.purchasesList) parsed.purchasesList = defaultState.purchasesList;
    if (!parsed.maternityBag) parsed.maternityBag = defaultState.maternityBag;
    if (!parsed.appointments) parsed.appointments = defaultState.appointments;
    if (!parsed.dailyGameScores) parsed.dailyGameScores = defaultState.dailyGameScores;
    if (!parsed.messages) parsed.messages = defaultState.messages;
    return parsed;
  } catch (err) {
    console.error("Error reading db file, resetting to default:", err);
    return defaultState;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing db:", err);
  }
}

module.exports = {
  // SETTINGS & CODE PIN PARENTS (1234)
  getSettings() {
    const data = readDb();
    return data.settings || defaultState.settings;
  },

  updateSettings(newSettings) {
    const data = readDb();
    data.settings = { ...data.settings, ...newSettings };
    writeDb(data);
    return data.settings;
  },

  getParentPin() {
    const data = readDb();
    return data.settings?.parentPin || "1234";
  },

  verifyParentPin(pin) {
    const data = readDb();
    const currentPin = data.settings?.parentPin || "1234";
    return currentPin === (pin || '').trim();
  },

  changeParentPin(oldPin, newPin) {
    const data = readDb();
    const currentPin = data.settings?.parentPin || "1234";
    if (currentPin !== (oldPin || '').trim()) {
      return { success: false, error: "Ancien code secret incorrect." };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, error: "Le nouveau code doit comporter au moins 4 caractères." };
    }
    if (!data.settings) data.settings = defaultState.settings;
    data.settings.parentPin = newPin.trim();
    writeDb(data);
    return { success: true };
  },

  // PARTICIPANTS
  getParticipants() {
    const data = readDb();
    return data.participants || [];
  },

  addOrUpdateParticipant(participantData) {
    const data = readDb();
    if (!data.participants) data.participants = [];
    const pseudo = (participantData.name || participantData.pseudo || '').trim();
    if (!pseudo) return data.participants;

    const existingIdx = data.participants.findIndex(
      p => p.name.toLowerCase() === pseudo.toLowerCase()
    );

    const participantObj = {
      id: existingIdx >= 0 ? data.participants[existingIdx].id : "p-" + Date.now(),
      name: pseudo,
      photo: participantData.photo || null,
      avatar: participantData.avatar || "🦕",
      role: participantData.role || "Proche",
      updatedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      data.participants[existingIdx] = participantObj;
    } else {
      data.participants.push(participantObj);
    }

    writeDb(data);
    return data.participants;
  },

  addParticipant(participantData) {
    return this.addOrUpdateParticipant(participantData);
  },

  updateParticipantPhoto(id, photo) {
    const data = readDb();
    if (!data.participants) data.participants = [];
    const idx = data.participants.findIndex(p => p.id === id);
    if (idx >= 0) {
      data.participants[idx].photo = photo;
      data.participants[idx].updatedAt = new Date().toISOString();
      writeDb(data);
    }
    return data.participants;
  },

  deleteParticipant(id) {
    const data = readDb();
    if (!data.participants) data.participants = [];
    data.participants = data.participants.filter(p => p.id !== id);
    writeDb(data);
    return data.participants;
  },

  // PREDICTIONS
  getPredictions() {
    const data = readDb();
    return {
      isBorn: data.settings?.isBorn || false,
      actualBirth: data.settings?.actualBirth || null,
      predictions: data.predictions || []
    };
  },

  addPrediction(prediction) {
    const data = readDb();
    if (!data.predictions) data.predictions = [];
    const newPred = {
      id: "pred-" + Date.now(),
      author: prediction.author,
      photo: prediction.photo || null,
      date: prediction.date,
      time: prediction.time,
      gender: "boy",
      firstName: prediction.firstName || "",
      weight: prediction.weight || "",
      height: prediction.height || "",
      eyeColor: prediction.eyeColor || "",
      hairColor: prediction.hairColor || "",
      resemblance: prediction.resemblance || "50% Alizée, 50% Lucas",
      message: prediction.message || "",
      createdAt: new Date().toISOString()
    };
    data.predictions.push(newPred);
    writeDb(data);
    return this.getPredictions();
  },

  setActualBirth(birthData) {
    const data = readDb();
    data.settings.isBorn = true;
    data.settings.actualBirth = {
      date: birthData.date,
      time: birthData.time,
      firstName: birthData.firstName,
      weight: birthData.weight,
      height: birthData.height,
      eyeColor: birthData.eyeColor,
      hairColor: birthData.hairColor,
      resemblance: birthData.resemblance,
      photo: birthData.photo || null,
      recordedAt: new Date().toISOString()
    };
    writeDb(data);
    return this.getPredictions();
  },

  resetBirthStatus() {
    const data = readDb();
    data.settings.isBorn = false;
    data.settings.actualBirth = null;
    writeDb(data);
    return this.getPredictions();
  },

  // POLLS / HÉSITATIONS
  getPolls() {
    const data = readDb();
    return data.polls || defaultState.polls;
  },

  addPoll(pollData) {
    const data = readDb();
    if (!data.polls) data.polls = defaultState.polls;
    const newPoll = {
      id: "poll-" + Date.now(),
      question: pollData.question,
      options: pollData.options.map(opt => ({ text: opt, votes: 0 })),
      votes: []
    };
    data.polls.push(newPoll);
    writeDb(data);
    return this.getPolls();
  },

  votePoll(pollId, optionIndex, voterName) {
    const data = readDb();
    const poll = (data.polls || []).find(p => p.id === pollId);
    if (!poll) return this.getPolls();

    if (!poll.votes) poll.votes = [];
    const prevVote = poll.votes.find(v => v.voterName.toLowerCase() === voterName.toLowerCase());
    if (prevVote) {
      if (poll.options[prevVote.optionIndex]) {
        poll.options[prevVote.optionIndex].votes = Math.max(0, poll.options[prevVote.optionIndex].votes - 1);
      }
      prevVote.optionIndex = optionIndex;
    } else {
      poll.votes.push({ voterName, optionIndex });
    }

    if (poll.options[optionIndex]) {
      poll.options[optionIndex].votes += 1;
    }

    writeDb(data);
    return this.getPolls();
  },

  deletePoll(id) {
    const data = readDb();
    data.polls = (data.polls || []).filter(p => p.id !== id);
    writeDb(data);
    return this.getPolls();
  },

  // MESSAGES / LIVRE D'OR
  getMessages() {
    const data = readDb();
    return data.messages || [];
  },

  addMessage(msgData) {
    const data = readDb();
    if (!data.messages) data.messages = [];
    const newMsg = {
      id: "msg-" + Date.now(),
      author: msgData.author || "Un proche",
      text: msgData.text,
      emoji: msgData.emoji || "💛",
      createdAt: new Date().toISOString()
    };
    data.messages.unshift(newMsg);
    writeDb(data);
    return data.messages;
  },

  deleteMessage(id) {
    const data = readDb();
    data.messages = (data.messages || []).filter(m => m.id !== id);
    writeDb(data);
    return this.getMessages();
  },

  // LISTE DES ACHATS & CATÉGORIES
  getPurchasesData() {
    const data = readDb();
    if (!data.purchasesCategories) data.purchasesCategories = defaultState.purchasesCategories;
    return {
      items: data.purchasesList || defaultState.purchasesList,
      categories: data.purchasesCategories
    };
  },

  addPurchaseCategory(categoryName) {
    const data = readDb();
    if (!data.purchasesCategories) data.purchasesCategories = defaultState.purchasesCategories;
    const clean = categoryName.trim();
    if (clean && !data.purchasesCategories.includes(clean)) {
      data.purchasesCategories.push(clean);
      writeDb(data);
    }
    return this.getPurchasesData();
  },

  deletePurchaseCategory(categoryName) {
    const data = readDb();
    if (!data.purchasesCategories) data.purchasesCategories = defaultState.purchasesCategories;
    data.purchasesCategories = data.purchasesCategories.filter(c => c !== categoryName);
    writeDb(data);
    return this.getPurchasesData();
  },

  addPurchaseItem(item) {
    const data = readDb();
    if (!data.purchasesList) data.purchasesList = defaultState.purchasesList;
    const newItem = {
      id: "item-" + Date.now(),
      title: item.title,
      category: item.category || "Indispensables 🌟",
      completed: false
    };
    data.purchasesList.push(newItem);
    writeDb(data);
    return this.getPurchasesData();
  },

  togglePurchaseItem(id) {
    const data = readDb();
    const item = (data.purchasesList || []).find(i => i.id === id);
    if (item) {
      item.completed = !item.completed;
      writeDb(data);
    }
    return this.getPurchasesData();
  },

  deletePurchaseItem(id) {
    const data = readDb();
    data.purchasesList = (data.purchasesList || []).filter(i => i.id !== id);
    writeDb(data);
    return this.getPurchasesData();
  },

  // VALISE DE MATERNITÉ
  getMaternityBag() {
    const data = readDb();
    return data.maternityBag || defaultState.maternityBag;
  },

  addMaternityBagItem(item) {
    const data = readDb();
    if (!data.maternityBag) data.maternityBag = defaultState.maternityBag;
    const newItem = {
      id: "mb-" + Date.now(),
      title: item.title,
      forWho: item.forWho || "baby",
      completed: false
    };
    data.maternityBag.push(newItem);
    writeDb(data);
    return this.getMaternityBag();
  },

  toggleMaternityBagItem(id) {
    const data = readDb();
    const item = (data.maternityBag || []).find(i => i.id === id);
    if (item) {
      item.completed = !item.completed;
      writeDb(data);
    }
    return this.getMaternityBag();
  },

  deleteMaternityBagItem(id) {
    const data = readDb();
    data.maternityBag = (data.maternityBag || []).filter(i => i.id !== id);
    writeDb(data);
    return this.getMaternityBag();
  },

  // APPOINTMENTS
  getAppointments() {
    const data = readDb();
    return (data.appointments || defaultState.appointments || []).sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  addAppointment(rdvData) {
    const data = readDb();
    if (!data.appointments) data.appointments = defaultState.appointments;
    const newRdv = {
      id: "rdv-" + Date.now(),
      title: rdvData.title,
      date: rdvData.date,
      time: rdvData.time || "09:00",
      location: rdvData.location || "",
      notes: rdvData.notes || "",
      completed: false
    };
    data.appointments.push(newRdv);
    writeDb(data);
    return this.getAppointments();
  },

  toggleAppointment(id) {
    const data = readDb();
    const rdv = (data.appointments || []).find(r => r.id === id);
    if (rdv) {
      rdv.completed = !rdv.completed;
      writeDb(data);
    }
    return this.getAppointments();
  },

  deleteAppointment(id) {
    const data = readDb();
    data.appointments = (data.appointments || []).filter(r => r.id !== id);
    writeDb(data);
    return this.getAppointments();
  },

  // MOTS CROISÉS & FLÉCHÉS (12 MOTS PAR JOUR • THÈMES BÉBÉ, ENFANTS, NOËL, FAMILLE)
  getDailyCrosswordsBank() {
    return [
      {
        dayIndex: 0,
        theme: "Nuit, Dodo & Doux Rêves de Bébé 🌙",
        description: "Les 12 indispensables pour bercer et endormir bébé paisiblement",
        words: [
          { id: 1, word: "DOUDOU", clue: "1. Le compagnon tout doux en peluche pour faire dodo", length: 6 },
          { id: 2, word: "BERCEUSE", clue: "2. La douce mélodie chantée pour calmer et endormir bébé", length: 8 },
          { id: 3, word: "VEILLEUSE", clue: "3. La petite lumière tamisée magique qui rassure la nuit", length: 9 },
          { id: 4, word: "GIGOTEUSE", clue: "4. Le petit sac de couchage douillet une pièce pour la nuit", length: 9 },
          { id: 5, word: "PYJAMA", clue: "5. Le vêtement en velours bien chaud pour faire de beaux rêves", length: 6 },
          { id: 6, word: "BERCEAU", clue: "6. Le premier petit lit douillet à barreaux", length: 7 },
          { id: 7, word: "TETINE", clue: "7. La sucette apaisante pour les petits chagrins", length: 6 },
          { id: 8, word: "MATELAS", clue: "8. Le support bien ferme et respirant pour le dos de bébé", length: 7 },
          { id: 9, word: "DRAP", clue: "9. Le tissu en coton bio tout doux qui habille le lit", length: 4 },
          { id: 10, word: "ETOILE", clue: "10. Lumière scintillante dessinée sur le mobile de nuit", length: 6 },
          { id: 11, word: "LANGE", clue: "11. Tissu en mousseline multifonctions pour les câlins", length: 5 },
          { id: 12, word: "CALIN", clue: "12. Moment infini de tendresse dans les bras des parents", length: 5 }
        ]
      },
      {
        dayIndex: 1,
        theme: "Noël Magique & Hiver en Famille 🎄❄️",
        description: "Les 12 merveilles des fêtes de fin d'année et des cadeaux",
        words: [
          { id: 1, word: "SAPIN", clue: "1. Le bel arbre vert décoré de boules et de guirlandes", length: 5 },
          { id: 2, word: "CADEAU", clue: "2. Le paquet surprise emballé de rubans dorés", length: 6 },
          { id: 3, word: "GUIRLANDE", clue: "3. Ruban étincelant qui brille de mille feux", length: 9 },
          { id: 4, word: "RENNE", clue: "4. Animal magique du Père Noël au nez parfois rouge", length: 5 },
          { id: 5, word: "BOUGIE", clue: "5. Petite flamme chaleureuse sur la table du réveillon", length: 6 },
          { id: 6, word: "CHOCOLAT", clue: "6. Gourmandise sucrée incontournable des fêtes", length: 8 },
          { id: 7, word: "NEIGE", clue: "7. Jolis flocons blancs qui tombent en hiver", length: 5 },
          { id: 8, word: "CHEMINEE", clue: "8. Là où crépite un bon feu de bois réconfortant", length: 8 },
          { id: 9, word: "LUTIN", clue: "9. Petit assistant joyeux qui fabrique les jouets", length: 5 },
          { id: 10, word: "TRAINEAU", clue: "10. Le véhicule volant qui traverse le ciel étoilé", length: 8 },
          { id: 11, word: "ETOILE", clue: "11. Décoration dorée posée tout en haut du sapin", length: 6 },
          { id: 12, word: "REVEILLON", clue: "12. Le grand repas festif partagé en famille le 24 au soir", length: 9 }
        ]
      },
      {
        dayIndex: 2,
        theme: "Les Moments & Retrouvailles en Famille 🏡❤️",
        description: "Les 12 bonheurs simples partagés avec ceux qu'on aime",
        words: [
          { id: 1, word: "DIMANCHE", clue: "1. Le jour parfait pour se réunir autour d'un grand déjeuner", length: 8 },
          { id: 2, word: "REPAS", clue: "2. Moment gourmand partagé tous ensemble autour de la table", length: 5 },
          { id: 3, word: "SOUVENIR", clue: "3. Instant précieux gravé à jamais dans nos cœurs", length: 8 },
          { id: 4, word: "RIRE", clue: "4. Éclat de joie communicatif qui résonne dans la maison", length: 4 },
          { id: 5, word: "COUSIN", clue: "5. Membre de la famille avec qui on fait plein de bêtises", length: 6 },
          { id: 6, word: "TANTE", clue: "6. La super tata gâteau qui prend soin de nous", length: 5 },
          { id: 7, word: "BALADE", clue: "7. Promenade digestive tous ensemble au grand air", length: 6 },
          { id: 8, word: "JEUX", clue: "8. Activités de société animées qui réunissent les générations", length: 4 },
          { id: 9, word: "ALBUM", clue: "9. Livre de photos de famille qu'on adore feuilleter", length: 5 },
          { id: 10, word: "FETE", clue: "10. Célébration joyeuse d'un anniversaire ou d'une naissance", length: 4 },
          { id: 11, word: "TENDRESSE", clue: "11. Douceur et affection infinie envers les siens", length: 9 },
          { id: 12, word: "MAISON", clue: "12. Le foyer chaleureux où toute la famille se rassemble", length: 6 }
        ]
      },
      {
        dayIndex: 3,
        theme: "Repas, Biberons & Gourmandises de Bébé 🍼",
        description: "Les 12 essentiels de l'alimentation et de la diversification",
        words: [
          { id: 1, word: "BIBERON", clue: "1. Le récipient magique pour le lait chaud du matin", length: 7 },
          { id: 2, word: "BAVOIR", clue: "2. Le tissu protecteur indispensable contre les taches", length: 6 },
          { id: 3, word: "COMPOTE", clue: "3. Les délicieux fruits mixés pour le goûter de 16h", length: 7 },
          { id: 4, word: "CUILLERE", clue: "4. Petit couvert doux en silicone adapté aux petites bouches", length: 8 },
          { id: 5, word: "CHAISE", clue: "5. Siège haut pour manger à table avec toute la famille", length: 6 },
          { id: 6, word: "LAITAGE", clue: "6. Petit yaourt brassé spécial pour les tout-petits", length: 7 },
          { id: 7, word: "PUREE", clue: "7. Délicieuse préparation de légumes doux mixés (carottes, courgettes)", length: 5 },
          { id: 8, word: "GOUPILLON", clue: "8. Brosse spéciale pour nettoyer les parois du biberon", length: 9 },
          { id: 9, word: "CHAUFFE", clue: "9. Appareil pratique pour tiédir le lait à la température idéale", length: 7 },
          { id: 10, word: "BISCUIT", clue: "10. Petit gâteau fondant pour faire ses premières dents", length: 7 },
          { id: 11, word: "TASSE", clue: "11. Récipient d'apprentissage à anses pour boire de l'eau", length: 5 },
          { id: 12, word: "GOUTER", clue: "12. Le délicieux repas sucré de l'après-midi", length: 6 }
        ]
      },
      {
        dayIndex: 4,
        theme: "La Vie d'Enfant & Jeux de Récré 🎒🎨",
        description: "Les 12 plaisirs de l'enfance, de l'école et des copains",
        words: [
          { id: 1, word: "RECREATION", clue: "1. Le moment préféré de la journée pour courir dans la cour", length: 10 },
          { id: 2, word: "CARTABLE", clue: "2. Le sac d'écolier porté sur le dos pour aller en classe", length: 8 },
          { id: 3, word: "PEINTURE", clue: "3. Activité artistique colorée avec les doigts ou un pinceau", length: 8 },
          { id: 4, word: "DESSIN", clue: "4. Jolie œuvre d'art offerte avec amour à maman et papa", length: 6 },
          { id: 5, word: "MAITRESSE", clue: "5. L'enseignante bienveillante qui apprend à lire et écrire", length: 9 },
          { id: 6, word: "COPAIN", clue: "6. Le meilleur ami avec qui on partage ses jeux", length: 6 },
          { id: 7, word: "TOBOGGAN", clue: "7. Grand jeu de glisse incontournable au parc", length: 8 },
          { id: 8, word: "VELO", clue: "8. Deux-roues avec petites roulettes pour devenir grand", length: 4 },
          { id: 9, word: "HISTOIRE", clue: "9. Le récit passionnant lu par les parents avant de dormir", length: 8 },
          { id: 10, word: "BALLON", clue: "10. Sphère en cuir ou mousse pour marquer des buts", length: 6 },
          { id: 11, word: "BONBON", clue: "11. Petite douceur fruitée pour les grandes occasions", length: 6 },
          { id: 12, word: "GOMMETTE", clue: "12. Petit autocollant coloré à coller partout sur les cahiers", length: 8 }
        ]
      },
      {
        dayIndex: 5,
        theme: "Le Bain & Les Soins Douceur de Bébé 🛁",
        description: "Les 12 secrets pour un bain relaxant et une peau parfumée",
        words: [
          { id: 1, word: "BAIGNOIRE", clue: "1. Le petit bassin ergonomique pour barboter dans l'eau tiède", length: 9 },
          { id: 2, word: "LINIMENT", clue: "2. Soin naturel à l'huile d'olive pour nettoyer le siège", length: 8 },
          { id: 3, word: "COUCHE", clue: "3. La protection absorbante la plus changée de la journée", length: 6 },
          { id: 4, word: "THERMOMETRE", clue: "4. Instrument pour vérifier que l'eau du bain est à 37°C", length: 11 },
          { id: 5, word: "SERVIETTE", clue: "5. Cape de bain toute douce avec capuche pour le séchage", length: 9 },
          { id: 6, word: "MOUSSE", clue: "6. Les jolies bulles légères qui flottent sur l'eau", length: 6 },
          { id: 7, word: "COTON", clue: "7. Petits coussinets doux pour nettoyer les yeux et le visage", length: 5 },
          { id: 8, word: "CREME", clue: "8. Pommade hydratante protectrice pour les petites rougeurs", length: 5 },
          { id: 9, word: "BROSSE", clue: "9. Accessoire aux poils soyeux pour coiffer les premiers cheveux", length: 6 },
          { id: 10, word: "CANARD", clue: "10. Le petit jouet jaune flottant inséparable de la baignoire", length: 6 },
          { id: 11, word: "PARFUM", clue: "11. Eau de senteur délicate sans alcool pour bébé", length: 6 },
          { id: 12, word: "MATELAS", clue: "12. Support molletonné plastifié de la table à langer", length: 7 }
        ]
      },
      {
        dayIndex: 6,
        theme: "Les Animaux Mignons & Safari Rigolo 🦁🐾",
        description: "Les 12 animaux préférés des tout-petits",
        words: [
          { id: 1, word: "LIONCEAU", clue: "1. Le petit félin roi de la savane", length: 8 },
          { id: 2, word: "GIRAFE", clue: "2. Grand animal jaune au cou immense qui broute les feuilles", length: 6 },
          { id: 3, word: "ELEPHANT", clue: "3. Gros mammifère gris avec une grande trompe et de grandes oreilles", length: 8 },
          { id: 4, word: "OURSON", clue: "4. Bébé ours tout doux qui raffole du bon miel", length: 6 },
          { id: 5, word: "LAPIN", clue: "5. Animal aux grandes oreilles qui adore les carottes", length: 5 },
          { id: 6, word: "CHATON", clue: "6. Bébé chat qui ronronne dès qu'on le caresse", length: 6 },
          { id: 7, word: "CHIOT", clue: "7. Petit toutou joueur qui remue la queue", length: 5 },
          { id: 8, word: "PINGOUIN", clue: "8. Oiseau marin dandinant sur la banquise en smoking", length: 8 },
          { id: 9, word: "ZEBRE", clue: "9. Cheval sauvage à rayures noires et blanches", length: 5 },
          { id: 10, word: "KOALA", clue: "10. Petit marsupial tout doux qui dort dans les eucalyptus", length: 5 },
          { id: 11, word: "PANDA", clue: "11. Grand nounours noir et blanc mangeur de bambou", length: 5 },
          { id: 12, word: "DAUPHIN", clue: "12. Ami des océans qui saute gracieusement hors de l'eau", length: 7 }
        ]
      },
      {
        dayIndex: 7,
        theme: "Contes de Fées, Magie & Chevaliers 🏰✨",
        description: "Les 12 symboles féeriques des histoires du soir",
        words: [
          { id: 1, word: "CHATEAU", clue: "1. Somptueuse forteresse royale aux grandes tours", length: 7 },
          { id: 2, word: "COURONNE", clue: "2. Diadème étincelant orné de pierres précieuses", length: 8 },
          { id: 3, word: "BAGUETTE", clue: "3. Accessoire magique de la fée pour exaucer les vœux", length: 8 },
          { id: 4, word: "DRAGON", clue: "4. Créature ailée légendaire qui crache des étincelles", length: 6 },
          { id: 5, word: "ETOILE", clue: "5. Poussière brillante qui veille sur les rêves", length: 6 },
          { id: 6, word: "PRINCE", clue: "6. Héros vaillant au grand cœur", length: 6 },
          { id: 7, word: "LICORNE", clue: "7. Cheval blanc féerique à la corne torsadée multicolore", length: 7 },
          { id: 8, word: "POTION", clue: "8. Breuvage enchanté aux effets magiques et mystérieux", length: 6 },
          { id: 9, word: "TRESOR", clue: "9. Coffre rempli de pièces d'or et de merveilles", length: 6 },
          { id: 10, word: "LIVRE", clue: "10. Recueil de contes qu'on ouvre avant de dormir", length: 5 },
          { id: 11, word: "SECRET", clue: "11. Mystère bien gardé dans le royaume", length: 6 },
          { id: 12, word: "MAGIE", clue: "12. Pouvoir extraordinaire qui fait briller les yeux des enfants", length: 5 }
        ]
      },
      {
        dayIndex: 8,
        theme: "Printemps Ensoleillé, Fleurs & Nature 🌸☀️",
        description: "Les 12 beautés du renouveau printanier",
        words: [
          { id: 1, word: "TULIPE", clue: "1. Belle fleur colorée qui s'épanouit au jardin", length: 6 },
          { id: 2, word: "PAPILLON", clue: "2. Insecte aux ailes chamarrées qui voltige de fleur en fleur", length: 8 },
          { id: 3, word: "SOLEIL", clue: "3. Grand astre lumineux qui réchauffe les après-midis", length: 6 },
          { id: 4, word: "OISEAU", clue: "4. Petit chanteur ailé qui fabrique son nid dans les arbres", length: 6 },
          { id: 5, word: "JARDIN", clue: "5. Espace vert fleuri où l'on cueille des herbes fraîches", length: 6 },
          { id: 6, word: "ARROSOIR", clue: "6. Récipient à pommeau pour donner à boire aux plantes", length: 8 },
          { id: 7, word: "BOURGEON", clue: "7. Petite pousse verte qui annonce la naissance d'une feuille", length: 8 },
          { id: 8, word: "MARGUERITE", clue: "8. Fleur blanche au cœur jaune dont on effeuille les pétales", length: 10 },
          { id: 9, word: "ABEILLE", clue: "9. Ouvrière précieuse qui butine le pollen pour faire du miel", length: 7 },
          { id: 10, word: "HERBE", clue: "10. Tapis vert bien frais sur lequel on marche pieds nus", length: 5 },
          { id: 11, word: "ROSEE", clue: "11. Petites gouttes d'eau scintillantes au petit matin", length: 5 },
          { id: 12, word: "PIQUE", clue: "12. Déjeuner champêtre sur une nappe à carreaux dans l'herbe", length: 5 }
        ]
      },
      {
        dayIndex: 9,
        theme: "Vacances d'Été & Bord de Mer 🏖️🌊",
        description: "Les 12 plaisirs estivaux les pieds dans le sable",
        words: [
          { id: 1, word: "PLAGE", clue: "1. Grande étendue de sable doré face à l'océan", length: 5 },
          { id: 2, word: "CHATEAU", clue: "2. Forteresse éphémère sculptée avec du sable mouillé et un seau", length: 7 },
          { id: 3, word: "COQUILLAGE", clue: "3. Jolie trouvaille nacrée ramassée sur le rivage", length: 10 },
          { id: 4, word: "GLACE", clue: "4. Délicieux cornet rafraîchissant à la fraise ou vanille", length: 5 },
          { id: 5, word: "SERVIETTE", clue: "5. Grand drap de plage moelleux étalé pour bronzer", length: 9 },
          { id: 6, word: "PARASOL", clue: "6. Grand abri coloré pour se reposer à l'ombre", length: 7 },
          { id: 7, word: "BOUEE", clue: "7. Flotteur gonflable pour barboter en toute sécurité", length: 5 },
          { id: 8, word: "LUNETTES", clue: "8. Accessoire teinté indispensable pour protéger les yeux du soleil", length: 8 },
          { id: 9, word: "CREME", clue: "9. Lotion solaire indice 50 pour protéger la peau de bébé", length: 5 },
          { id: 10, word: "VAGUE", clue: "10. Mouvement de l'eau qui vient chatouiller les orteils", length: 5 },
          { id: 11, word: "PELLE", clue: "11. Outil en plastique indispensable pour creuser des tranchées", length: 5 },
          { id: 12, word: "BATEAU", clue: "12. Voilier blanc qui glisse doucement sur l'eau bleue", length: 6 }
        ]
      },
      {
        dayIndex: 10,
        theme: "Jouets d'Éveil, Puzzles & Peluches 🧸🧩",
        description: "Les 12 divertissements préférés pour s'amuser et grandir",
        words: [
          { id: 1, word: "PELUCHE", clue: "1. Animal en tissu ultra doux qu'on serre fort contre soi", length: 7 },
          { id: 2, word: "PUZZLE", clue: "2. Jeu de pièces en bois à encastrer pour former une image", length: 6 },
          { id: 3, word: "HOCHET", clue: "3. Petit grelot à secouer qui fait du bruit et éveille bébé", length: 6 },
          { id: 4, word: "CUBE", clue: "4. Bloc de construction coloré qu'on empile pour faire des tours", length: 4 },
          { id: 5, word: "TAPIS", clue: "5. Aire de motricité matelassée avec arches d'activités", length: 5 },
          { id: 6, word: "POUPEE", clue: "6. Petit personnage qu'on habille et berce comme un bébé", length: 6 },
          { id: 7, word: "CAMION", clue: "7. Véhicule miniature pour transporter des petits trésors", length: 6 },
          { id: 8, word: "PORTIQUE", clue: "8. Structure en bois avec jouets suspendus au-dessus de bébé", length: 8 },
          { id: 9, word: "BALLON", clue: "9. Sphère en tissu qu'on fait rouler sur le sol", length: 6 },
          { id: 10, word: "XILOPHONE", clue: "10. Petit instrument de musique coloré à lames sonores", length: 9 },
          { id: 11, word: "LIVRE", clue: "11. Ouvrage cartonné avec matières douces à toucher", length: 5 },
          { id: 12, word: "MOBILE", clue: "12. Suspensions musicales au-dessus du lit qui tournent", length: 6 }
        ]
      },
      {
        dayIndex: 11,
        theme: "Pâtisserie, Goûters & Douceurs 🧁🍓",
        description: "Les 12 gourmandises préparées avec amour pour le goûter",
        words: [
          { id: 1, word: "GATEAU", clue: "1. Pâtisserie moelleuse au yaourt ou au chocolat", length: 6 },
          { id: 2, word: "CREPE", clue: "2. Galette fine et dorée garnie de confiture ou sucre", length: 5 },
          { id: 3, word: "FRAISE", clue: "3. Petit fruit rouge juteux et sucré adoré des enfants", length: 6 },
          { id: 4, word: "CHOCOLAT", clue: "4. Délicieuse saveur cacao fondante", length: 8 },
          { id: 5, word: "BRIOCHE", clue: "5. Pain au beurre tout chaud et gonflé du dimanche matin", length: 7 },
          { id: 6, word: "BISCUIT", clue: "6. Sablé croustillant à tremper dans le verre de lait", length: 7 },
          { id: 7, word: "BANANE", clue: "7. Fruit doux jaune facile à écraser pour les premiers goûters", length: 6 },
          { id: 8, word: "FARINE", clue: "8. Poudre blanche indispensable dans la pâte à gâteaux", length: 6 },
          { id: 9, word: "SUCRE", clue: "9. Ingrédient qui donne un goût si doux aux desserts", length: 5 },
          { id: 10, word: "POMME", clue: "10. Fruit croquant cuit en douce compote à la cannelle", length: 5 },
          { id: 11, word: "VANILLE", clue: "11. Parfum exquis issu d'une gousse noire précieuse", length: 7 },
          { id: 12, word: "GOUTER", clue: "12. La pause sucrée la plus attendue de l'après-midi à 16h", length: 6 }
        ]
      },
      {
        dayIndex: 12,
        theme: "Papi, Mamie & Les Trésors de Famille 👵👴",
        description: "Les 12 marques d'amour des grands-parents chéris",
        words: [
          { id: 1, word: "MAMIE", clue: "1. La grand-mère attentionnée qui prépare les meilleurs plats", length: 5 },
          { id: 2, word: "PAPI", clue: "2. Le grand-père bricoleur qui raconte les plus belles histoires", length: 4 },
          { id: 3, word: "CALIN", clue: "3. Étreinte chaleureuse et réconfortante", length: 5 },
          { id: 4, word: "GATEAU", clue: "4. Recette secrète préparée spécialement pour la visite des petits", length: 6 },
          { id: 5, word: "ALBUM", clue: "5. Recueil de photos anciennes en noir et blanc", length: 5 },
          { id: 6, word: "JARDIN", clue: "6. Potager où l'on récolte les fraises avec papi", length: 6 },
          { id: 7, word: "SOUVENIR", clue: "7. Trésor précieux que le temps ne peut effacer", length: 8 },
          { id: 8, word: "BONBON", clue: "8. Petite friandise donnée en cachette avec un clin d'œil", length: 6 },
          { id: 9, word: "HISTOIRE", clue: "9. Récit du passé raconté au coin du feu", length: 8 },
          { id: 10, word: "AMOUR", clue: "10. Sentiment immense et inconditionnel pour les petits-enfants", length: 5 },
          { id: 11, word: "SAGESSE", clue: "11. Précieux conseils guidés par l'expérience de la vie", length: 7 },
          { id: 12, word: "SUDOKU", clue: "12. Petit jeu de logique du journal du matin", length: 6 }
        ]
      },
      {
        dayIndex: 13,
        theme: "Premiers Pas & Grandir Jour après Jour 👣💫",
        description: "Les 12 étapes magiques de la première année de vie",
        words: [
          { id: 1, word: "SOURIRE", clue: "1. La première mimique radieuse offerte à papa et maman", length: 7 },
          { id: 2, word: "BABIL", clue: "2. Les adorables premiers gazouillements et sons de bébé", length: 5 },
          { id: 3, word: "DENT", clue: "3. La première petite perle blanche qui pousse dans la bouche", length: 4 },
          { id: 4, word: "PAS", clue: "4. Déplacements hésitants puis assurés sur deux petites jambes", length: 3 },
          { id: 5, word: "CHAUSSON", clue: "5. Petite chaussure en cuir souple qui protège les petits pieds", length: 8 },
          { id: 6, word: "MOTRICITE", clue: "6. Développement de l'équilibre et des mouvements", length: 9 },
          { id: 7, word: "REGARD", clue: "7. Grands yeux curieux qui découvrent le monde qui l'entoure", length: 6 },
          { id: 8, word: "EVEIL", clue: "8. Émerveillement face aux sons, aux couleurs et aux formes", length: 5 },
          { id: 9, word: "BISOUS", clue: "9. Milliers de baisers doux déposés sur les joues potelées", length: 6 },
          { id: 10, word: "BRAVO", clue: "10. Les applaudissements joyeux des parents à chaque progrès", length: 5 },
          { id: 11, word: "COURAGE", clue: "11. Force déployée pour se relever après chaque petite chute", length: 7 },
          { id: 12, word: "GRANDIR", clue: "12. La plus belle aventure de toute l'enfance", length: 7 }
        ]
      }
    ];
  },

  getDailyCrosswordGrid(dateStr = null) {
    const bank = this.getDailyCrosswordsBank();
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    
    // Obtenir la date locale YYYY-MM-DD en heure de Paris
    const parisFormatter = new Intl.DateTimeFormat('fr-CA', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const actualDateStr = dateStr || parisFormatter.format(targetDate);

    // Calcul de l'index du jour de l'année
    const [y, m, d] = actualDateStr.split('-').map(Number);
    const startOfYear = new Date(Date.UTC(y, 0, 1));
    const currentDay = new Date(Date.UTC(y, m - 1, d));
    const dayOfYear = Math.floor((currentDay - startOfYear) / (1000 * 60 * 60 * 24));
    
    const gridIndex = Math.abs(dayOfYear) % bank.length;
    const grid = bank[gridIndex];

    return {
      date: actualDateStr,
      dayNumber: dayOfYear + 1,
      ...grid
    };
  },

  getCrosswordLeaderboards(dateStr = null) {
    const data = readDb();
    const list = data.dailyGameScores || [];
    
    const parisFormatter = new Intl.DateTimeFormat('fr-CA', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const today = dateStr || parisFormatter.format(new Date());

    const todayScores = list
      .filter(s => s.date === today)
      .sort((a, b) => b.points - a.points || a.timeSeconds - b.timeSeconds);

    const playerMap = {};
    list.forEach(score => {
      const p = score.playerName;
      if (!playerMap[p]) {
        playerMap[p] = {
          playerName: p,
          totalPoints: 0,
          daysPlayed: 0,
          bestTimeFormatted: score.timeFormatted,
          bestTimeSeconds: score.timeSeconds,
          lastPlayedDate: score.date
        };
      }
      playerMap[p].totalPoints += (score.points || 0);
      playerMap[p].daysPlayed += 1;
      if (score.timeSeconds < playerMap[p].bestTimeSeconds) {
        playerMap[p].bestTimeSeconds = score.timeSeconds;
        playerMap[p].bestTimeFormatted = score.timeFormatted;
      }
      if (new Date(score.date) > new Date(playerMap[p].lastPlayedDate)) {
        playerMap[p].lastPlayedDate = score.date;
      }
    });

    const globalLeaderboard = Object.values(playerMap).sort((a, b) => b.totalPoints - a.totalPoints);

    return {
      todayDate: today,
      todayScores,
      globalLeaderboard,
      allScores: list
    };
  },

  submitCrosswordScore(scoreData) {
    const data = readDb();
    if (!data.dailyGameScores) data.dailyGameScores = [];

    const parisFormatter = new Intl.DateTimeFormat('fr-CA', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const todayStr = scoreData.date || parisFormatter.format(new Date());
    const timeSec = Number(scoreData.timeSeconds) || 60;
    const correctCount = Number(scoreData.correctCount) || 0;
    const totalWords = Number(scoreData.totalWords) || 12;

    const existingIndex = data.dailyGameScores.findIndex(
      s => s.date === todayStr && s.playerName.toLowerCase() === (scoreData.playerName || '').toLowerCase()
    );

    if (existingIndex >= 0) {
      const existing = data.dailyGameScores[existingIndex];
      return {
        alreadySubmitted: true,
        awardedPoints: existing.points,
        correctCount: existing.correctCount,
        totalWords: existing.totalWords,
        ...this.getCrosswordLeaderboards(todayStr)
      };
    }

    const wordPoints = correctCount * 60;
    const speedBonus = Math.max(0, Math.round((240 - timeSec) * 1.5));
    const calculatedPoints = Math.max(50, wordPoints + (correctCount >= 6 ? speedBonus : 0));

    const newEntry = {
      id: "score-" + Date.now(),
      playerName: scoreData.playerName || "Un proche",
      date: todayStr,
      theme: scoreData.theme || "Mots Fléchés (12 Mots)",
      timeSeconds: timeSec,
      timeFormatted: scoreData.timeFormatted || "01:00",
      correctCount,
      totalWords,
      points: calculatedPoints,
      createdAt: new Date().toISOString()
    };

    data.dailyGameScores.push(newEntry);
    writeDb(data);

    return {
      alreadySubmitted: false,
      awardedPoints: calculatedPoints,
      correctCount,
      totalWords,
      ...this.getCrosswordLeaderboards(todayStr)
    };
  },

  // QUIZ DUEL ALIZÉE VS LUCAS (50 QUESTIONS • 5 CATÉGORIES)
  getQuizQuestions() {
    return alizeeQuizQuestions;
  },

  getQuizVotes() {
    const data = readDb();
    return data.quizVotes || [];
  },

  addQuizVote(vote) {
    const data = readDb();
    if (!data.quizVotes) data.quizVotes = [];
    
    const existingIndex = data.quizVotes.findIndex(
      v => v.questionId === vote.questionId && (v.voter || '').toLowerCase() === (vote.voter || '').toLowerCase()
    );

    if (existingIndex >= 0) {
      data.quizVotes[existingIndex] = { ...vote, timestamp: new Date().toISOString() };
    } else {
      data.quizVotes.push({ ...vote, timestamp: new Date().toISOString() });
    }

    writeDb(data);
    return this.getQuizAggregates();
  },

  getQuizAggregates() {
    const data = readDb();
    const votes = data.quizVotes || [];

    const stats = {};
    alizeeQuizQuestions.forEach(q => {
      stats[q.id] = {
        questionId: q.id,
        category: q.category,
        categoryIcon: q.categoryIcon,
        question: q.question,
        trait: q.trait,
        totalVotes: 0,
        alizeeVotes: 0,
        lucasVotes: 0,
        alizeePercent: 50,
        lucasPercent: 50
      };
    });

    votes.forEach(v => {
      if (stats[v.questionId]) {
        stats[v.questionId].totalVotes += 1;
        if (v.choice === 'Alizée' || v.choice === 'alizee') {
          stats[v.questionId].alizeeVotes += 1;
        } else if (v.choice === 'Lucas' || v.choice === 'lucas') {
          stats[v.questionId].lucasVotes += 1;
        }
      }
    });

    Object.values(stats).forEach(s => {
      if (s.totalVotes > 0) {
        s.alizeePercent = Math.round((s.alizeeVotes / s.totalVotes) * 100);
        s.lucasPercent = 100 - s.alizeePercent;
      }
    });

    let totalAlizee = 0;
    let totalLucas = 0;
    let totalAllVotes = 0;
    Object.values(stats).forEach(s => {
      totalAlizee += s.alizeeVotes;
      totalLucas += s.lucasVotes;
      totalAllVotes += s.totalVotes;
    });

    // Compute category breakdown
    const categoryMap = {};
    Object.values(stats).forEach(s => {
      if (!categoryMap[s.category]) {
        categoryMap[s.category] = {
          category: s.category,
          categoryIcon: s.categoryIcon,
          totalVotes: 0,
          alizeeVotes: 0,
          lucasVotes: 0,
          questionsCount: 0
        };
      }
      categoryMap[s.category].questionsCount += 1;
      categoryMap[s.category].totalVotes += s.totalVotes;
      categoryMap[s.category].alizeeVotes += s.alizeeVotes;
      categoryMap[s.category].lucasVotes += s.lucasVotes;
    });

    const byCategory = Object.values(categoryMap).map(c => {
      const aPct = c.totalVotes > 0 ? Math.round((c.alizeeVotes / c.totalVotes) * 100) : 50;
      const lPct = c.totalVotes > 0 ? (100 - aPct) : 50;
      return {
        ...c,
        alizeePercent: aPct,
        lucasPercent: lPct,
        winner: aPct > lPct ? 'Alizée' : lPct > aPct ? 'Lucas' : 'Égalité'
      };
    });

    const uniqueVoters = new Set((data.quizVotes || []).map(v => (v.voter || '').trim().toLowerCase()).filter(Boolean));
    const uniqueVotersCount = uniqueVoters.size;

    return {
      questions: Object.values(stats),
      summary: {
        totalVotes: totalAllVotes,
        uniqueVotersCount,
        alizeeScore: totalAlizee,
        lucasScore: totalLucas,
        alizeeGlobalPercent: totalAllVotes > 0 ? Math.round((totalAlizee / totalAllVotes) * 100) : 50,
        lucasGlobalPercent: totalAllVotes > 0 ? Math.round((totalLucas / totalAllVotes) * 100) : 50,
        byCategory
      }
    };
  }
};

const alizeeQuizQuestions = [
  // 1. Le plus nocturne & patient 🌙
  { id: 1, category: "Le plus nocturne & patient", categoryIcon: "🌙", question: "Qui va changer une couche en moins de 30 secondes chrono ?", trait: "Le plus rapide des couches" },
  { id: 2, category: "Le plus nocturne & patient", categoryIcon: "🌙", question: "Qui va se lever à 3h du matin sans râler pour le biberon ?", trait: "Le plus grand gardien des nuits" },
  { id: 3, category: "Le plus nocturne & patient", categoryIcon: "🌙", question: "Qui va le plus paniquer au départ pour la maternité ?", trait: "Le plus sous pression" },
  { id: 4, category: "Le plus nocturne & patient", categoryIcon: "🌙", question: "Qui va tester la température du biberon 4 fois de suite ?", trait: "Le plus minutieux du biberon" },
  { id: 5, category: "Le plus nocturne & patient", categoryIcon: "🌙", question: "Qui va installer la poussette le plus vite sans s'énerver ?", trait: "Le plus pro de la poussette" },
  { id: 6, category: "Le plus nocturne & patient", categoryIcon: "🌙", question: "Qui va passer le plus de temps à lui coiffer ses premiers cheveux ?", trait: "Le plus styliste capillaire" },
  { id: 7, category: "Le plus nocturne & patient", categoryIcon: "🌙", question: "Qui va préparer son sac de sortie avec 12 rechanges de secours ?", trait: "Le plus prévoyant de l'extrême" },
  { id: 8, category: "Le plus nocturne & patient", categoryIcon: "🌙", question: "Qui va le plus surveiller la caméra du babyphone la nuit ?", trait: "Le plus espion nocturne" },
  { id: 9, category: "Le plus nocturne & patient", categoryIcon: "🌙", question: "Qui aura le plus de patience lors des poussées dentaires ?", trait: "Le plus patient avec les quenottes" },
  { id: 10, category: "Le plus nocturne & patient", categoryIcon: "🌙", question: "Qui sera le premier debout dès le tout premier gazouillis ?", trait: "Le plus rapide au réveil" },

  // 2. Le plus joueur & complice 🤪
  { id: 11, category: "Le plus joueur & complice", categoryIcon: "🤪", question: "Qui va lui apprendre à faire des bêtises en cachette ?", trait: "Le plus complice des bêtises" },
  { id: 12, category: "Le plus joueur & complice", categoryIcon: "🤪", question: "Qui va lui faire son premier fou rire incontrôlable ?", trait: "Le roi du fou rire" },
  { id: 13, category: "Le plus joueur & complice", categoryIcon: "🤪", question: "Qui va lui apprendre ses premiers gros mots sans faire exprès ?", trait: "Le plus gaffeur de langage" },
  { id: 14, category: "Le plus joueur & complice", categoryIcon: "🤪", question: "Qui va lui apprendre à faire des grimaces rigolotes ?", trait: "Le champion des grimaces" },
  { id: 15, category: "Le plus joueur & complice", categoryIcon: "🤪", question: "Qui aura le plus de mal à lui refuser un deuxième dessert ?", trait: "Le plus faible devant les douceurs" },
  { id: 16, category: "Le plus joueur & complice", categoryIcon: "🤪", question: "Qui va le plus céder quand bébé fera ses yeux doux pour un jouet ?", trait: "Le plus facile à amadouer" },
  { id: 17, category: "Le plus joueur & complice", categoryIcon: "🤪", question: "Qui va le plus s'endormir avant le bébé pendant la berceuse ?", trait: "Le champion de la sieste express" },
  { id: 18, category: "Le plus joueur & complice", categoryIcon: "🤪", question: "Qui sera le roi/la reine des chatouilles du soir ?", trait: "Le pro des chatouilles" },
  { id: 19, category: "Le plus joueur & complice", categoryIcon: "🤪", question: "Qui va le plus chanter (même faux) pour l'endormir ?", trait: "Le plus grand chanteur d'opéra" },
  { id: 20, category: "Le plus joueur & complice", categoryIcon: "🤪", question: "À qui va-t-il dire son premier mot (Alizée ou Lucas) ?", trait: "Le gagnant du premier mot" },

  // 3. Le plus aventurier & sportif ⚽
  { id: 21, category: "Le plus aventurier & sportif", categoryIcon: "⚽", question: "Qui va lui apprendre à taper dans son premier ballon ?", trait: "Le plus coach sportif" },
  { id: 22, category: "Le plus aventurier & sportif", categoryIcon: "⚽", question: "Qui va lui acheter son premier vélo à roulettes ?", trait: "Le pro des deux-roues" },
  { id: 23, category: "Le plus aventurier & sportif", categoryIcon: "⚽", question: "Qui va lui apprendre à faire du vélo sans les petites roues ?", trait: "Le cascadeur de vitesse" },
  { id: 24, category: "Le plus aventurier & sportif", categoryIcon: "⚽", question: "Qui va lui faire faire des acrobaties d'avion dans les bras ?", trait: "Le pilote de voltige" },
  { id: 25, category: "Le plus aventurier & sportif", categoryIcon: "⚽", question: "Qui va lui faire écouter sa musique préférée en premier ?", trait: "Le plus mélomane rockstar" },
  { id: 26, category: "Le plus aventurier & sportif", categoryIcon: "⚽", question: "Qui va lui raconter le plus d'histoires de super-héros ?", trait: "Le conteur de super-héros" },
  { id: 27, category: "Le plus aventurier & sportif", categoryIcon: "⚽", question: "Qui va lui lire 5 histoires d'affilée le soir ?", trait: "Le plus grand lecteur du soir" },
  { id: 28, category: "Le plus aventurier & sportif", categoryIcon: "⚽", question: "Qui va le plus s'amuser avec ses petites voitures et ses dinos ?", trait: "Le meilleur ami des dinos" },
  { id: 29, category: "Le plus aventurier & sportif", categoryIcon: "⚽", question: "Qui va lui apprendre à nager en premier dans le grand bain ?", trait: "Le maître nageur" },
  { id: 30, category: "Le plus aventurier & sportif", categoryIcon: "⚽", question: "Qui sera le plus fier lors de ses premiers pas ?", trait: "Le plus fier des premiers pas" },

  // 4. Le plus dépensier 🛍️
  { id: 31, category: "Le plus dépensier", categoryIcon: "🛍️", question: "Qui va prendre 1000 photos par jour de notre petit garçon ?", trait: "Le paparazzi officiel" },
  { id: 32, category: "Le plus dépensier", categoryIcon: "🛍️", question: "Qui va acheter le plus de petits vêtements craquants ?", trait: "Le plus acheteur compulsif" },
  { id: 33, category: "Le plus dépensier", categoryIcon: "🛍️", question: "Qui va passer 20 minutes à choisir sa tenue du jour ?", trait: "Le styliste officiel" },
  { id: 34, category: "Le plus dépensier", categoryIcon: "🛍️", question: "Qui va lui acheter sa première casquette trop mignonne ?", trait: "Le plus fan de casquettes" },
  { id: 35, category: "Le plus dépensier", categoryIcon: "🛍️", question: "Qui va le premier craquer pour lui offrir une draisienne ?", trait: "Le plus gâteau sur les cadeaux" },
  { id: 36, category: "Le plus dépensier", categoryIcon: "🛍️", question: "Qui va le plus hésiter entre deux paires de petits chaussons ?", trait: "Le plus hésitant en boutique" },
  { id: 37, category: "Le plus dépensier", categoryIcon: "🛍️", question: "Qui va garder tous ses dessins de maternelle précieusement ?", trait: "Le conservateur des souvenirs" },
  { id: 38, category: "Le plus dépensier", categoryIcon: "🛍️", question: "Qui va préparer les meilleures petites purées maison ?", trait: "Le chef cuistot" },
  { id: 39, category: "Le plus dépensier", categoryIcon: "🛍️", question: "Qui va passer le plus de temps à ranger les jouets du salon ?", trait: "La fée du logis" },
  { id: 40, category: "Le plus dépensier", categoryIcon: "🛍️", question: "Qui va lui organiser la plus belle fête d'anniversaire ?", trait: "Le roi de l'événementiel" },

  // 5. Le plus câlin 🥰
  { id: 41, category: "Le plus câlin", categoryIcon: "🥰", question: "Qui va pleurer d'émotion en le voyant pour la première fois ?", trait: "Le plus ému aux larmes" },
  { id: 42, category: "Le plus câlin", categoryIcon: "🥰", question: "Qui sera le parent le plus gâteau / poule ?", trait: "Le plus parent poule" },
  { id: 43, category: "Le plus câlin", categoryIcon: "🥰", question: "Qui va le plus le couvrir de bisous sur les joues ?", trait: "La machine à bisous" },
  { id: 44, category: "Le plus câlin", categoryIcon: "🥰", question: "Qui va le plus s'émerveiller devant chaque petit rot ?", trait: "Le plus émerveillé" },
  { id: 45, category: "Le plus câlin", categoryIcon: "🥰", question: "Qui va le plus stresser à la moindre petite toux ?", trait: "Le plus stressé pour sa santé" },
  { id: 46, category: "Le plus câlin", categoryIcon: "🥰", question: "Qui va le plus s'inquiéter le premier jour à la crèche / nounou ?", trait: "Le plus fusionnel" },
  { id: 47, category: "Le plus câlin", categoryIcon: "🥰", question: "Qui va le plus le bercer tendrement pendant des heures ?", trait: "Le plus doux des berceurs" },
  { id: 48, category: "Le plus câlin", categoryIcon: "🥰", question: "Qui va le plus lui faire des papouilles sous les pieds ?", trait: "Le pro des papouilles" },
  { id: 49, category: "Le plus câlin", categoryIcon: "🥰", question: "Qui va le plus le regarder dormir avec des cœurs dans les yeux ?", trait: "Le plus gaga absolu" },
  { id: 50, category: "Le plus câlin", categoryIcon: "🥰", question: "Qui est le plus impatient de le tenir dans ses bras ?", trait: "Le plus impatient d'amour" }
];
