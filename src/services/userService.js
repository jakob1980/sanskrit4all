// src/services/userService.js
// Questo servizio gestisce tutte le chiamate relative agli utenti

export async function getUsers() {
  return await window.electronAPI.getUsers();
}

export async function createUser(name) {
  return await window.electronAPI.createUser(name);
}
