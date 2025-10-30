// src/services/letterService.js
// Questo servizio gestisce le chiamate relative alle lettere e ai progressi
import data from '../data.json';

export async function getLetters(userId) {
  return data.letters;
}

export async function markAsViewed(letterId, userId) {
  const userProgress = data.progress[userId] || [];
  if (!userProgress.includes(letterId.toString())) {
    userProgress.push(letterId.toString());
    data.progress[userId] = userProgress;
    return true;
  }
  return false;
}
