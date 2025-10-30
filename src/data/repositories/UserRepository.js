const { readData, writeData } = require('../db.js');

class UserRepository {
  findAll() {
    return readData().users;
  }

  create(name) {
    const data = readData();
    const newUser = {
      id: data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1,
      name: name,
      created_at: Date.now()
    };
    data.users.push(newUser);
    data.progress[newUser.id.toString()] = [];
    writeData(data);
    return newUser;
  }
}

module.exports = { UserRepository };
