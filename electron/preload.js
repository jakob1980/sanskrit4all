// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Audio functions
  playAudio: (audioPath) => ipcRenderer.invoke('play-audio', audioPath),
  
  // Database functions
  getLettersWithProgress: () => ipcRenderer.invoke('get-letters-with-progress'),
  markAsViewed: (letterId) => ipcRenderer.invoke('mark-as-viewed', letterId),
  
  // Nuove funzioni per la gestione utenti e progressi
  getUsers: () => ipcRenderer.invoke('get-users'),
  createUser: (name) => ipcRenderer.invoke('create-user', name),
  getLetters: (userId) => ipcRenderer.invoke('get-letters', userId),
  markAsViewedByUser: (letterId, userId) => ipcRenderer.invoke('mark-as-viewed-by-user', letterId, userId),
});
