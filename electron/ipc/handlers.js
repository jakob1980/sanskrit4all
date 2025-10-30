// electron/ipc/handlers.js
const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// Importiamo le classi dei repository
const { UserRepository, LetterRepository, ProgressRepository } = require('../../src/data/repositories/index.js');

// Importiamo il servizio di autenticazione
const { AuthService } = require('../services/AuthService.js');

// Istanziamo i repository (potrebbero essere singleton in un'app più grande)
const userRepo = new UserRepository();
const letterRepo = new LetterRepository();
const progressRepo = new ProgressRepository();

// Istanziamo il servizio di autenticazione
const authService = new AuthService();

// Funzione per registrare tutti gli handler
function registerIpcHandlers() {
  // IPC Handler per l'audio - Step 1
  ipcMain.handle('play-audio', async (event, audioPath) => {
    try {
      console.log('IPC: Reading audio file:', audioPath);
      
      // Costruisci il percorso assoluto del file audio
      const audioFileName = audioPath.split('/').pop(); // Prendi solo il nome del file
      const absolutePath = path.join(__dirname, '..', '..', 'assets', 'audio', audioFileName);
      
      console.log('IPC: Absolute path:', absolutePath);
      
      // Verifica che il file esista
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Audio file not found: ${absolutePath}`);
      }
      
      // Leggi il file come Buffer
      const audioBuffer = fs.readFileSync(absolutePath);
      console.log('IPC: File read successfully, size:', audioBuffer.length);
      
      // Restituisci il Buffer al renderer
      return {
        success: true,
        audioBuffer: audioBuffer.toString('base64'), // Converte in base64 per sicurezza
        fileName: audioFileName
      };
    } catch (error) {
      console.error('IPC: Failed to read audio file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // NUOVI handler per l'autenticazione
  ipcMain.handle('auth-register', async (event, name, email, password) => {
    try {
      return await authService.register(name, email, password);
    } catch (error) {
      console.error('Registration error:', error);
      // Rilancia l'errore per poterlo gestire nel frontend
      throw error;
    }
  });

  ipcMain.handle('auth-login', async (event, email, password) => {
    try {
      return await authService.login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  });

  // Handler per gli utenti (ancora utili per il "Guest")
  ipcMain.handle('get-users', () => userRepo.findAll());
  ipcMain.handle('create-user', (event, name) => userRepo.create(name));

  // Handler per le lettere e progressi
  ipcMain.handle('get-letters', (event, userId) => letterRepo.findAllWithProgress(userId));
  ipcMain.handle('mark-as-viewed', (event, letterId, userId) => progressRepo.markAsViewed(letterId, userId));
}

// Esportiamo la funzione per usarla in altri moduli
module.exports = { registerIpcHandlers };
