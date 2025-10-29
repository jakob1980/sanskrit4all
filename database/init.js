// database/init.js
const Database = require('better-sqlite3');
const path = require('path');

// Initialize database and create tables
function initializeDatabase() {
  const dbPath = path.join(__dirname, 'app.db');
  const db = new Database(dbPath);

  // Create letters table
  db.exec(`
    CREATE TABLE IF NOT EXISTS letters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character TEXT NOT NULL UNIQUE,
      romanization TEXT NOT NULL,
      audio_path TEXT NOT NULL
    )
  `);

  // Create progress table
  db.exec(`
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      letter_id INTEGER NOT NULL,
      viewed_at INTEGER NOT NULL,
      FOREIGN KEY (letter_id) REFERENCES letters (id) ON DELETE CASCADE,
      UNIQUE(letter_id)
    )
  `);

  // Seed initial letters if table is empty
  const count = db.prepare('SELECT COUNT(*) as count FROM letters').get();
  
  if (count.count === 0) {
    const insert = db.prepare(`
      INSERT INTO letters (character, romanization, audio_path)
      VALUES (?, ?, ?)
    `);

    const initialLetters = [
      ['अ', 'a', 'assets/audio/a.mp3'],
      ['आ', 'ā', 'assets/audio/aa.mp3'],
      ['इ', 'i', 'assets/audio/i.mp3']
    ];

    const transaction = db.transaction((letters) => {
      for (const letter of letters) {
        insert.run(...letter);
      }
    });

    transaction(initialLetters);
    console.log('Database initialized with initial Sanskrit letters.');
  } else {
    console.log('Database already contains letters.');
  }

  db.close();
}

initializeDatabase();
