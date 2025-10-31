import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { registerIpcHandlers } from './ipc/handlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Function to check if a port has a web server running
async function checkPort(port) {
  const http = await import('http');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 2000
    };
    
    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve(port);
      } else {
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.on('error', (err) => {
      if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        reject(new Error('Connection refused'));
      } else {
        reject(err);
      }
    });
    
    req.end();
  });
}

// Function to wait for Vite to be ready
async function waitForVite(maxAttempts = 30) {
  console.log('Searching for Vite server on ports 5177-5200...');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Attempt ${attempt}: Scanning for Vite...`);
    
    // Check multiple ports in sequence
    for (let port = 5177; port <= 5200; port++) {
      try {
        await checkPort(port);
        console.log(`✓ Vite found running on port ${port}!`);
        return port;
      } catch (error) {
        // Port not available, continue
        continue;
      }
    }
    
    // If we get here, no port responded
    if (attempt < maxAttempts) {
      console.log(`No Vite server found, retrying in 1 second...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  throw new Error('Vite server not found after multiple attempts');
}

function createWindow(vitePort) {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // Configurazioni per evitare problemi di cache
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  // Carica l'app servita da Vite sulla porta corretta
  const viteUrl = `http://localhost:${vitePort}`;
  console.log(`Loading Electron with Vite at: ${viteUrl}`);
  mainWindow.loadURL(viteUrl);
  
  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(async () => {
  try {
    initializeData();
    
    // Wait for Vite to be ready
    console.log('Waiting for Vite to be ready...');
    const vitePort = await waitForVite();
    console.log(`Vite is ready on port ${vitePort}`);
    
    // Register IPC handlers
    registerIpcHandlers();
    
    // Create window with correct port
    createWindow(vitePort);
    
    console.log('Electron app started successfully!');
  } catch (error) {
    console.error('Failed to start Electron app:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    // In case of activation, try to find Vite again
    waitForVite().then(vitePort => {
      createWindow(vitePort);
    }).catch(error => {
      console.error('Failed to reactivate app:', error);
    });
  }
});

// Configurazione per evitare errori di cache
app.commandLine.appendSwitch('--disable-gpu');
app.commandLine.appendSwitch('--disable-software-rasterizer');
app.commandLine.appendSwitch('--disable-gpu-sandbox');
app.commandLine.appendSwitch('--no-sandbox');
