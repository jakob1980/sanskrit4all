// src/data/prisma.js
import { PrismaClient } from '@prisma/client';

// Evitiamo di creare più connessioni al database
const prisma = new PrismaClient();

export default prisma;
