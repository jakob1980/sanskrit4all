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

// Database handlers using JSON
ipcMain.handle('get-letters-with-progress', async (event) => {
  try {
    const data = readData();
    const lettersWithProgress = data.letters.map(letter => ({
      ...letter,
      is_viewed: data.progress.includes(letter.id)
    }));
    return lettersWithProgress;
  } catch (error) {
    console.error('Failed to get letters with progress:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('mark-as-viewed', async (event, letterId) => {
  try {
    const data = readData();
    if (!data.progress.includes(letterId)) {
      data.progress.push(letterId);
      if (writeData(data)) {
        return { success: true, changed: true };
      }
    }
    return { success: true, changed: false };
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
