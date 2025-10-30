const { readData, writeData } = require('../db.js');

class ProgressRepository {
  markAsViewed(letterId, userId) {
    const data = readData();
    const userProgress = data.progress[userId.toString()] || [];
    
    if (userProgress.includes(letterId.toString())) {
      return false;
    }

    userProgress.push(letterId.toString());
    data.progress[userId.toString()] = userProgress;
    writeData(data);
    return true;
  }
}

module.exports = { ProgressRepository };
