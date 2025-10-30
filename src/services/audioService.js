// src/services/audioService.js
// Questo servizio gestisce le chiamate relative all'audio

export async function playAudio(audioPath) {
  return await window.electronAPI.playAudio(audioPath);
}
