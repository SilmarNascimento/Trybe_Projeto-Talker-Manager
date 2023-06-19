const express = require('express');
const { findAll } = require('./db/talkerDB');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (request, response, next) => {
  console.log('cheguei aqui');
  const data = await findAll();
  console.log(data);
  return response.status(200).json(data);
})

app.listen(PORT, () => {
  console.log('Online');
});
