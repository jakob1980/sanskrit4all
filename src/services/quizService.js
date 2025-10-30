// src/services/quizService.js
import { getLetters } from './letterService.js';

// Funzione helper per mescolare un array (algoritmo Fisher-Yates)
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export async function generateQuizQuestion(userId) {
  // 1. Ottieni tutte le lettere
  const allLetters = await getLetters(userId);
  if (allLetters.length < 4) {
    throw new Error("Non abbastanza lettere per creare un quiz.");
  }

  // 2. Scegli una lettera casuale come risposta corretta
  const correctLetter = allLetters[Math.floor(Math.random() * allLetters.length)];

  // 3. Scegli 3 lettere sbagliate
  const wrongLetters = allLetters.filter(l => l.id !== correctLetter.id);
  const selectedWrong = shuffle(wrongLetters).slice(0, 3);

  // 4. Crea le opzioni e mescolale
  const options = [
    { id: correctLetter.id, text: correctLetter.romanization, isCorrect: true },
    ...selectedWrong.map(l => ({ id: l.id, text: l.romanization, isCorrect: false }))
  ];
  
  const shuffledOptions = shuffle(options);

  return {
    question: correctLetter,
    options: shuffledOptions
  };
}
