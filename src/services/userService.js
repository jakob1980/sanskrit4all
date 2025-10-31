// Questo servizio gestisce tutte le chiamate relative agli utenti
import data from '../data.json';

console.log('UserService: Inizializzazione...');

// Vecchie funzioni (per Guest)
export async function getUsers() {
  console.log('UserService: Caricamento utenti da JSON locale...');
  return data.users;
}

export async function createUser(name) {
  console.log('UserService: Creazione nuovo utente:', name);
  const newUser = {
    id: data.users.length + 1,
    name: name,
    email: null,
    password_hash: null,
    created_at: Date.now()
  };
  
  data.users.push(newUser);
  return newUser;
}

// NUOVE funzioni di autenticazione (solo Electron)
export async function register(name, email, password) {
  console.log('UserService: Tentativo registrazione per:', email);
  
  // Verifica se siamo in ambiente Electron
  if (!window.electronAPI) {
    console.error('UserService: window.electronAPI non disponibile');
    console.log('UserService: Verifica ambiente - isElectron?', window.electronAPI?.isElectron?.());
    throw new Error('Funzionalità di autenticazione non disponibile. Assicurati che l\'applicazione sia in esecuzione in Electron.');
  }
  
  console.log('UserService: Chiamata authRegister via Electron API...');
  return await window.electronAPI.authRegister(name, email, password);
}

export async function login(email, password) {
  console.log('UserService: Tentativo login per:', email);
  
  // Verifica se siamo in ambiente Electron
  if (!window.electronAPI) {
    console.error('UserService: window.electronAPI non disponibile');
    console.log('UserService: Verifica ambiente - isElectron?', window.electronAPI?.isElectron?.());
    throw new Error('Funzionalità di autenticazione non disponibile. Assicurati che l\'applicazione sia in esecuzione in Electron.');
  }
  
  console.log('UserService: Chiamata authLogin via Electron API...');
  return await window.electronAPI.authLogin(email, password);
}

// Funzione di utilità per verificare l'ambiente
export function checkElectronEnvironment() {
  const hasElectronAPI = !!window.electronAPI;
  const isElectron = window.electronAPI?.isElectron?.() || false;
  const userAgent = navigator.userAgent;
  
  console.log('UserService: Stato ambiente:', {
    hasElectronAPI,
    isElectron,
    userAgent: userAgent.includes('Electron') ? 'Electron' : 'Browser'
  });
  
  return {
    hasElectronAPI,
    isElectron,
    isBrowser: !isElectron
  };
}
