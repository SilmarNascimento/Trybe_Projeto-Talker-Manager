const express = require('express');
const { findAll } = require('./db/talkerDB');
const { readFile } = require('./utils/fs');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (request, response, next) => {
  const data = await readFile();
  console.log(data);
  return response.status(HTTP_OK_STATUS).json(data);
})

app.listen(PORT, () => {
  console.log('Online');
});
