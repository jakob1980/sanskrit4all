// electron/services/AuthService.js
const bcrypt = require('bcrypt');
const { UserRepository } = require('../../src/data/repositories/index.js');

const BCRYPT_ROUNDS = 12;

class AuthService {
  async register(name, email, password) {
    // Validazione base
    if (!name || name.length < 3) throw new Error('Il nome deve essere di almeno 3 caratteri.');
    if (!email || !email.includes('@')) throw new Error('Inserisci un\'email valida.');
    if (!password || password.length < 8) throw new Error('La password deve essere di almeno 8 caratteri.');

    // Hash della password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Creazione dell'utente
    const userRepo = new UserRepository();
    const newUser = userRepo.create(name, email, passwordHash);
    
    // Rimuoviamo l'hash prima di inviare i dati al frontend
    const { password_hash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(email, password) {
    // Trova l'utente per email
    const userRepo = new UserRepository();
    const users = userRepo.findAll();
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
}

module.exports = { AuthService };
