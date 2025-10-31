const Database = require('better-sqlite3');
const db = new Database('database/app.db');

console.log('Tabelle esistenti:');
const tables = db.prepare('SELECT name FROM sqlite_master WHERE type=\'table\'').all();
tables.forEach(t => console.log('- ' + t.name));

// Verifica la struttura della tabella users
console.log('\nStruttura tabella users:');
try {
  const usersStructure = db.prepare('PRAGMA table_info(users)').all();
  usersStructure.forEach(col => console.log(`- ${col.name} (${col.type})`));
} catch (error) {
  console.log('Tabella users non esiste');
}

db.close();
