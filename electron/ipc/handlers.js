// electron/ipc/handlers.js
const { ipcMain } = require('electron');
const player = require('play-sound');
const path = require('path');

// Importiamo le classi dei repository
const { UserRepository, LetterRepository, ProgressRepository } = require('../../src/data/repositories/index.js');

// Istanziamo i repository (potrebbero essere singleton in un'app più grande)
const userRepo = new UserRepository();
const letterRepo = new LetterRepository();
const progressRepo = new ProgressRepository();

// Funzione per registrare tutti gli handler
function registerIpcHandlers() {
  // Handler per l'audio
  ipcMain.handle('play-audio', async (event, audioPath) => {
    try {
      const absolutePath = path.join(__dirname, '..', '..', audioPath);
      player().play(absolutePath, (err) => {
        if (err) console.error(`Error playing sound: ${err}`);
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to play audio:', error);
      return { success: false, error: error.message };
    }
  });

  // Handler per gli utenti
  ipcMain.handle('get-users', () => userRepo.findAll());
  ipcMain.handle('create-user', (event, name) => userRepo.create(name));

  // Handler per le lettere e progressi
  ipcMain.handle('get-letters', (event, userId) => letterRepo.findAllWithProgress(userId));
  ipcMain.handle('mark-as-viewed', (event, letterId, userId) => progressRepo.markAsViewed(letterId, userId));
}

// Esportiamo la funzione per usarla in altri moduli
module.exports = { registerIpcHandlers };
