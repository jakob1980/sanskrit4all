// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Audio functions
  playAudio: (audioPath) => ipcRenderer.invoke('play-audio', audioPath),
  
  // Database functions
  getLettersWithProgress: () => ipcRenderer.invoke('get-letters-with-progress'),
  markAsViewed: (letterId) => ipcRenderer.invoke('mark-as-viewed', letterId),
});
