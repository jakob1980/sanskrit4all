// src/services/userService.js
// Questo servizio gestisce tutte le chiamate relative agli utenti
import data from '../data.json';

// Vecchie funzioni (per Guest)
export async function getUsers() {
  return data.users;
}

export async function createUser(name) {
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
  return await window.electronAPI.authRegister(name, email, password);
}

export async function login(email, password) {
  return await window.electronAPI.authLogin(email, password);
}
