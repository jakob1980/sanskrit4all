-- database/schema.sql

-- Tabella per le lettere (contenuto statico)
CREATE TABLE IF NOT EXISTS letters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  character TEXT UNIQUE NOT NULL,
  romanization TEXT NOT NULL,
  audio_path TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella per il progresso (dati utente, per ora globali)
CREATE TABLE IF NOT EXISTS progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  letter_id INTEGER NOT NULL,
  viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (letter_id) REFERENCES letters (id) ON DELETE CASCADE,
  UNIQUE(letter_id) -- Assicura che ogni lettera possa essere segnata come vista una sola volta
);