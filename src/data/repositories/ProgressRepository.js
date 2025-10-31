// src/data/repositories/ProgressRepository.js
import prisma from '../prisma.js';

export class ProgressRepository {
  async markAsViewed(letterId, userId) {
    // Prisma ha un metodo upsert perfetto per questo caso d'uso
    const progress = await prisma.progress.upsert({
      where: {
        userId_letterId: { // Usiamo la chiave unica che abbiamo definito
          userId: userId,
          letterId: letterId,
        }
      },
      update: {}, // Non c'è nulla da aggiornare se esiste già
      create: { // Crealo se non esiste
        userId: userId,
        letterId: letterId,
      }
    });
    // Se l'oggetto esisteva già, upsert non fa nulla e lo restituisce.
    // Dobbiamo controllare se è stato creato ora.
    const wasCreated = progress.viewedAt.getTime() === Date.now(); // Semplice controllo, potrebbe essere migliorato
    return wasCreated;
  }
}
