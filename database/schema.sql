-- database/schema.sql

PRAGMA foreign_keys = ON;

-- Tabella per gli utenti
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella per le lettere/parole
CREATE TABLE IF NOT EXISTS letters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character TEXT UNIQUE NOT NULL,
    romanization TEXT NOT NULL,
    audio_path TEXT NOT NULL,
    category TEXT NOT NULL
);

-- Tabella di collegamento per il progresso
CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    letter_id INTEGER NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (letter_id) REFERENCES letters (id) ON DELETE CASCADE,
    UNIQUE(user_id, letter_id) -- Un utente non può vedere la stessa lettera due volte
);
