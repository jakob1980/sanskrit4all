// electron/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { registerIpcHandlers } = require('./ipc/handlers.js');

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

app.whenReady().then(() => {
  initializeData();
  registerIpcHandlers(); // Registra tutti gli handler IPC
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
