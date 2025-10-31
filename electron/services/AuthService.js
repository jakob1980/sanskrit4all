// electron/services/AuthService.js
import bcrypt from 'bcrypt';
import { UserRepository } from '../../src/data/repositories/index.js';

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
    const newUser = await userRepo.create(name, email, passwordHash);

    // Il metodo create già esclude il passwordHash, quindi possiamo restituire direttamente
    return newUser;
  }

  async login(email, password) {
    // Trova l'utente per email
    const userRepo = new UserRepository();
    const user = await userRepo.findByEmail(email);

    if (!user || !user.passwordHash) {
      throw new Error('Email o password non corretti.');
    }

    // Confronta la password in chiaro con l'hash salvato
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Email o password non corretti.');
    }

    // Rimuoviamo l'hash prima di inviare i dati al frontend
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export { AuthService };
