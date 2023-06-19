const fs = require('fs').promises;
const path = require('path');

const PATH = '../talker.json';

async function readFile() {
  const data = await fs.readFile(path.resolve(__dirname, PATH), 'utf-8');
  return JSON.parse(data);
}

async function writeFile(data) {
  await fs.writeFile(path.resolve(__dirname, PATH), JSON.stringify(data, null, 2));
}

module.exports = {
  readFile,
  writeFile,
};
