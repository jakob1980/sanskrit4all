import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

const BCRYPT_ROUNDS = 12;

// Carica gli utenti dal file JSON
function loadUsers() {
  try {
    if (!fs.existsSync(usersFilePath)) {
      return [];
    }
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

// Salva gli utenti nel file JSON
function saveUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
}

class AuthService {
  async register(name, email, password) {
    // Validazione base
    if (!name || name.length < 3) throw new Error('Il nome deve essere di almeno 3 caratteri.');
    if (!email || !email.includes('@')) throw new Error('Inserisci un\'email valida.');
    if (!password || password.length < 8) throw new Error('La password deve essere di almeno 8 caratteri.');

    // Carica gli utenti esistenti
    const users = loadUsers();
    
    // Controlla se l'email esiste già
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Email già registrata.');
    }

    // Hash della password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Crea nuovo utente
    const newUser = {
      id: Date.now().toString(), // ID semplice basato su timestamp
      name,
      email,
      password_hash: passwordHash,
      created_at: new Date().toISOString()
    };

    // Aggiungi agli utenti e salva
    users.push(newUser);
    if (!saveUsers(users)) {
      throw new Error('Errore nel salvare l\'utente.');
    }

    // Rimuoviamo l'hash prima di inviare i dati al frontend
    const { password_hash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(email, password) {
    // Carica gli utenti
    const users = loadUsers();
    
    // Trova l'utente per email
    const user = users.find(u => u.email === email);

    if (!user || !user.password_hash) {
      throw new Error('Email o password non corretti.');
    }

    // Confronta la password in chiaro con l'hash salvato
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('Email o password non corretti.');
    }

    // Rimuoviamo l'hash prima di inviare i dati al frontend
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  getAllUsers() {
    // Restituisce tutti gli utenti senza le password
    const users = loadUsers();
    return users.map(({ password_hash, ...user }) => user);
  }
}

export { AuthService };
