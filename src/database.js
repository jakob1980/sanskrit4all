const fs = require('fs');
const path = require('path');

// Nel CommonJS, __dirname è già disponibile automaticamente
const dataPath = path.join(__dirname, 'data.json');

function readData() {
  const rawData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(rawData);
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// --- NUOVE FUNZIONI PER GLI UTENTI ---

function getUsers() {
  return readData().users;
}

function createUser(name) {
  const data = readData();
  const newUser = {
    id: data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1,
    name: name,
    created_at: Date.now()
  };
  data.users.push(newUser);
  // Inizializza il suo progresso vuoto
  data.progress[newUser.id.toString()] = [];
  writeData(data);
  return newUser;
}

// --- FUNZIONI AGGIORNATE PER LE LETTERE ---

function getLettersWithProgress(userId) {
  const data = readData();
  const viewedLetterIds = new Set(data.progress[userId.toString()] || []);

  return data.letters.map(letter => ({
    ...letter,
    is_viewed: viewedLetterIds.has(letter.id.toString())
  }));
}

function markAsViewed(letterId, userId) {
  const data = readData();
  const userProgress = data.progress[userId.toString()] || [];
  
  if (userProgress.includes(letterId.toString())) {
    return false;
  }

  userProgress.push(letterId.toString());
  data.progress[userId.toString()] = userProgress;
  writeData(data);
  return true;
}

module.exports = {
  getUsers,
  createUser,
  getLettersWithProgress,
  markAsViewed
};
