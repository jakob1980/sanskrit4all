// scripts/migrate-to-sqlite.js
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const jsonPath = path.join(__dirname, '..', 'src', 'data.json');
const dbPath = path.join(__dirname, '..', 'database', 'app.db');
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');

console.log('🚀 Starting migration to SQLite...');

// 1. Leggi il vecchio file JSON
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 2. Crea il nuovo database e applica lo schema
const db = new Database(dbPath);
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);
console.log('✅ Database schema created.');

// 3. Prepara gli statement di inserimento
const insertUser = db.prepare('INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)');
const insertLetter = db.prepare('INSERT INTO letters (id, character, romanization, audio_path, category) VALUES (?, ?, ?, ?, ?)');
const insertProgress = db.prepare('INSERT INTO progress (user_id, letter_id, viewed_at) VALUES (?, ?, ?)');

// 4. Migra gli utenti
const insertUsers = db.transaction((users) => {
    for (const user of users) {
        insertUser.run(user.id, user.name, user.email, user.password_hash, user.created_at);
    }
});
insertUsers(data.users);
console.log(`✅ Migrated ${data.users.length} users.`);

// 5. Migra le lettere
const insertLetters = db.transaction((letters) => {
    for (const letter of letters) {
        insertLetter.run(letter.id, letter.character, letter.romanization, letter.audio_path, letter.category);
    }
});
insertLetters(data.letters);
console.log(`✅ Migrated ${data.letters.length} letters.`);

// 6. Migra il progresso
const insertProgresses = db.transaction((userId, letterIds) => {
    for (const letterId of letterIds) {
        insertProgress.run(userId, letterId, Date.now());
    }
});
for (const userId in data.progress) {
    insertProgresses(userId, data.progress[userId]);
}
console.log(`✅ Migrated progress for ${Object.keys(data.progress).length} users.`);

db.close();
console.log('\n🎉 Migration complete! You can now delete src/data.json');
