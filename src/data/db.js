// src/data/db.js
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Il percorso del database è ora nella cartella 'database'
const dbPath = path.join(__dirname, '..', '..', 'database', 'app.db');

export const db = new Database(dbPath);

// Abilita le chiavi esterne per garantire l'integrità dei dati
db.pragma('foreign_keys = ON');
