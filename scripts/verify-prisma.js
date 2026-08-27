// scripts/verify-prisma.js
// Comando di verifica per l'inizializzazione di Prisma (vedi prisma-todo.md)
// Esegue letture e un round-trip CRUD tramite i repository a strati.
import prisma from '../src/data/prisma.js';
import { UserRepository, LetterRepository } from '../src/data/repositories/index.js';

async function main() {
  const userRepo = new UserRepository();
  const letterRepo = new LetterRepository();

  // 1. Conteggi grezzi sul database
  const [userCount, letterCount, progressCount] = await Promise.all([
    prisma.user.count(),
    prisma.letter.count(),
    prisma.progress.count(),
  ]);
  console.log(`Raw counts -> users: ${userCount}, letters: ${letterCount}, progress: ${progressCount}`);

  // 2. UserRepository.findAll
  const users = await userRepo.findAll();
  console.log(`UserRepository.findAll -> ${users.length} users:`, users.map((u) => `${u.name}<${u.email}>`).join(', '));

  // 3. LetterRepository.findAllWithProgress (per il primo utente disponibile)
  const targetUserId = users[0]?.id ?? 1;
  const letters = await letterRepo.findAllWithProgress(targetUserId);
  const viewed = letters.filter((l) => l.is_viewed).length;
  console.log(`LetterRepository.findAllWithProgress(${targetUserId}) -> ${letters.length} letters (${viewed} viewed); first: ${letters[0]?.character ?? '(none)'} (${letters[0]?.romanization ?? ''})`);

  // 4. Round-trip CRUD su un utente temporaneo
  const temp = await userRepo.create('__verify_temp__', '__verify_temp__@example.com', 'x'.repeat(60));
  console.log('Created temp user id =', temp.id);
  const found = await prisma.user.findUnique({ where: { id: temp.id } });
  console.log('Re-read temp user:', found?.name, '<' + found?.email + '>');
  await prisma.user.delete({ where: { id: temp.id } });
  console.log('Deleted temp user.');

  const after = await prisma.user.count();
  if (after !== userCount) {
    throw new Error(`User count mismatch after round-trip: ${after} != ${userCount}`);
  }
  console.log('User count after round-trip:', after, '(unchanged)');

  await prisma.$disconnect();
  console.log('\n✅ PRISMA VERIFICATION PASSED');
}

main().catch(async (e) => {
  console.error('❌ PRISMA VERIFICATION FAILED:', e);
  try {
    await prisma.$disconnect();
  } catch {}
  process.exit(1);
});
