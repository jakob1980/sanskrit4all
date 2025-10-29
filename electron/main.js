// electron/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const player = require('play-sound');

const dataPath = path.join(__dirname, '..', 'data', 'letterData.json');

// Initialize data file if it doesn't exist
function initializeData() {
  if (!fs.existsSync(dataPath)) {
    const initialData = {
      letters: [
        { id: 1, character: 'अ', romanization: 'a', audio_path: 'assets/audio/a.mp3' },
        { id: 2, character: 'आ', romanization: 'ā', audio_path: 'assets/audio/aa.mp3' },
        { id: 3, character: 'इ', romanization: 'i', audio_path: 'assets/audio/i.mp3' }
      ],
      progress: []
    };
    fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
    console.log('Data file initialized.');
  }
}

// Read data from JSON file
function readData() {
  try {
    const dataString = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(dataString);
  } catch (error) {
    console.error('Error reading data:', error);
    return { letters: [], progress: [] };
  }
}

// Write data to JSON file
function writeData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Carica l'app servita da Vite sulla porta corretta
  mainWindow.loadURL('http://localhost:5177');
}

// Audio playback handler
ipcMain.handle('play-audio', async (event, audioPath) => {
  try {
    const absolutePath = path.join(__dirname, '..', audioPath);
    console.log(`Attempting to play: ${absolutePath}`);
    
    player().play(absolutePath, (err) => {
      if (err) console.error(`Error playing sound: ${err}`);
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to play audio:', error);
    return { success: false, error: error.message };
  }
});

// Gestore per ottenere la lista degli utenti
ipcMain.handle('get-users', async (event) => {
  try {
    const { getUsers } = require('../src/database.js');
    return getUsers();
  } catch (error) {
    console.error('Failed to get users:', error);
    return { success: false, error: error.message };
  }
});

// Gestore per creare un nuovo utente
ipcMain.handle('create-user', async (event, name) => {
  try {
    const { createUser } = require('../src/database.js');
    return createUser(name);
  } catch (error) {
    console.error('Failed to create user:', error);
    return { success: false, error: error.message };
  }
});

// Gestore per ottenere le lettere con il progresso di un utente
ipcMain.handle('get-letters', async (event, userId) => {
  try {
    const { getLettersWithProgress } = require('../src/database.js');
    return getLettersWithProgress(userId);
  } catch (error) {
    console.error('Failed to get letters with progress:', error);
    return { success: false, error: error.message };
  }
});

// Gestore per segnare una lettera come vista per un utente (nuovo)
ipcMain.handle('mark-as-viewed-by-user', async (event, letterId, userId) => {
  try {
    const { markAsViewed } = require('../src/database.js');
    const result = markAsViewed(letterId, userId);
    return { success: true, changed: result };
  } catch (error) {
    console.error('Failed to mark as viewed:', error);
    return { success: false, error: error.message };
  }
});

// Gestore legacy per segnare una lettera come vista
ipcMain.handle('mark-as-viewed', async (event, letterId) => {
  try {
    const { markAsViewed } = require('../src/database.js');
    // Usa un userId di default (1) per compatibilità
    const result = markAsViewed(letterId, 1);
    return { success: true, changed: result };
  } catch (error) {
    console.error('Failed to mark as viewed:', error);
    return { success: false, error: error.message };
  }
});

app.whenReady().then(() => {
  initializeData();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
