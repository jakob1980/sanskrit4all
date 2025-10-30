// src/data/db.js
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'data.json');

function readData() {
  const rawData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(rawData);
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };
