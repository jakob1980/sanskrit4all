const { readData, writeData } = require('../db.js');

class UserRepository {
  findAll() {
    return readData().users;
  }

  create(name, email, passwordHash) { // Aggiungi i nuovi parametri
    const data = readData();
    const newUser = {
      id: data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1,
      name: name,
      email: email, // Salva l'email
      password_hash: passwordHash, // Salva l'hash
      created_at: Date.now()
    };
    data.users.push(newUser);
    data.progress[newUser.id.toString()] = [];
    writeData(data);
    return newUser;
  }
}

module.exports = { UserRepository };
