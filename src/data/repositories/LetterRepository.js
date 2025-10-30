const { readData } = require('../db.js');

class LetterRepository {
  findAllWithProgress(userId) {
    const data = readData();
    const viewedLetterIds = new Set(data.progress[userId.toString()] || []);
    return data.letters.map(letter => ({
      ...letter,
      is_viewed: viewedLetterIds.has(letter.id.toString())
    }));
  }
}

module.exports = { LetterRepository };
