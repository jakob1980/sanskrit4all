// src/data/repositories/LetterRepository.js
import prisma from '../prisma.js';

export class LetterRepository {
  async findAllWithProgress(userId) {
    const letters = await prisma.letter.findMany({
      orderBy: { id: 'asc' },
      include: { // Includiamo i dati del progresso per l'utente specificato
        progress: {
          where: { userId: userId },
          select: { viewedAt: true }
        }
      }
    });

    // Trasformiamo i dati per corrispondere al formato che ci aspettiamo
    return letters.map(letter => ({
      ...letter,
      is_viewed: letter.progress.length > 0,
      // Rimuoviamo il campo progress non necessario nel componente
      progress: undefined,
    }));
  }
}
