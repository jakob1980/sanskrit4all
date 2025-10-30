// src/data/repositories/index.js
const { UserRepository } = require('./UserRepository.js');
const { LetterRepository } = require('./LetterRepository.js');
const { ProgressRepository } = require('./ProgressRepository.js');

module.exports = { UserRepository, LetterRepository, ProgressRepository };
