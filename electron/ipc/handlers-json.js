import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

// Importiamo il servizio di autenticazione basato su JSON
import { AuthService } from '../services/AuthService-json.js';

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
      const absolutePath = path.join(process.cwd(), 'assets', 'audio', audioFileName);
      
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

  // NUOVI handler per l'autenticazione basati su JSON
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

  // Handler per ottenere tutti gli utenti (per modalità guest)
  ipcMain.handle('get-users', () => {
    try {
      return authService.getAllUsers();
    } catch (error) {
      console.error('Get users error:', error);
      return []; // Ritorna un array vuoto in caso di errore
    }
  });

  // Handler per le lettere (versione semplificata)
  ipcMain.handle('get-letters', (event, userId) => {
    try {
      const dataPath = path.join(process.cwd(), 'data', 'letterData.json');
      if (!fs.existsSync(dataPath)) {
        return [];
      }
      
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return data.letters || [];
    } catch (error) {
      console.error('Get letters error:', error);
      return [];
    }
  });

  // Handler per il progresso (versione semplificata)
  ipcMain.handle('mark-as-viewed', (event, letterId, userId) => {
    try {
      const dataPath = path.join(process.cwd(), 'data', 'letterData.json');
      if (!fs.existsSync(dataPath)) {
        return false;
      }
      
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // Aggiungi il progresso
      if (!data.progress) {
        data.progress = [];
      }
      
      // Controlla se l'utente ha già visto questa lettera
      const existingProgress = data.progress.find(p => 
        p.letterId === letterId && p.userId === userId
      );
      
      if (!existingProgress) {
        data.progress.push({
          letterId,
          userId,
          viewedAt: new Date().toISOString()
        });
        
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return true;
      }
      
      return true;
    } catch (error) {
      console.error('Mark as viewed error:', error);
      return false;
    }
  });
}

// Esportiamo la funzione per usarla in altri moduli
export { registerIpcHandlers };
