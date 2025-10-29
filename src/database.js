// src/database.js
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// In un modulo ES, __dirname non esiste. Lo simuliamo.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'database', 'app.db');
const db = new Database(dbPath);

// Funzione per ottenere tutte le lettere e il loro stato di progresso
export function getLettersWithProgress() {
  const stmt = db.prepare(`
    SELECT
      l.id,
      l.character,
      l.romanization,
      l.audio_path,
      p.viewed_at IS NOT NULL AS is_viewed
    FROM letters l
    LEFT JOIN progress p ON l.id = p.letter_id
    ORDER BY l.id
  `);
  return stmt.all();
}

// Funzione per segnare una lettera come vista
export function markAsViewed(letterId) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO progress (letter_id, viewed_at)
    VALUES (?, ?)
  `);
  const info = stmt.run(letterId, Date.now());
  return info.changes > 0; // Restituisce true se la riga è stata inserita
}

// Funzione per popolare il database con le lettere iniziali
export function seedLetters() {
  const initialLetters = [
    { character: 'अ', romanization: 'a', audio_path: 'assets/audio/a.mp3' },
    { character: 'आ', romanization: 'ā', audio_path: 'assets/audio/aa.mp3' },
    { character: 'इ', romanization: 'i', audio_path: 'assets/audio/i.mp3' },
  ];

  const insert = db.prepare(`
    INSERT OR IGNORE INTO letters (character, romanization, audio_path)
    VALUES (?, ?, ?)
  `);

  const insertMany = db.transaction((letters) => {
    for (const letter of letters) {
      insert.run(letter.character, letter.romanization, letter.audio_path);
    }
  });

  insertMany(initialLetters);
}
