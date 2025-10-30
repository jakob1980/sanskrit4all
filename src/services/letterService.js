// src/services/letterService.js
// Questo servizio gestisce le chiamate relative alle lettere e ai progressi

export async function getLetters(userId) {
  return await window.electronAPI.getLetters(userId);
}

export async function markAsViewed(letterId, userId) {
  return await window.electronAPI.markAsViewed(letterId, userId);
}
