// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Audio functions - Step 2
  playAudio: (audioPath) => ipcRenderer.invoke('play-audio', audioPath),
  
  // Vecchie funzioni (per Guest)
  getUsers: () => ipcRenderer.invoke('get-users'),
  
  // NUOVE funzioni di autenticazione
  authRegister: (name, email, password) => ipcRenderer.invoke('auth-register', name, email, password),
  authLogin: (email, password) => ipcRenderer.invoke('auth-login', email, password),
  
  // Funzioni per lettere e progressi
  getLetters: (userId) => ipcRenderer.invoke('get-letters', userId),
  markAsViewed: (letterId, userId) => ipcRenderer.invoke('mark-as-viewed', letterId, userId),
});
