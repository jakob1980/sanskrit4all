// src/data/repositories/UserRepository.js
import prisma from '../prisma.js';

export class UserRepository {
  async findAll() {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: { // Selezioniamo esplicitamente i campi, escludendo la password
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    });
    return users;
  }

  async create(name, email, passwordHash) {
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        passwordHash: passwordHash,
      },
      select: { // Restituiamo l'utente senza la password
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    });
    return newUser;
  }

  async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        createdAt: true,
      }
    });
    return user;
  }
}
