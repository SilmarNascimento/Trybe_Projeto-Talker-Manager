const express = require('express');
const { readFile } = require('./utils/fs');
const generateToken = require('./utils/generateToken');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_request, response, _next) => {
  const data = await readFile();
  // if (data.length === 0) return response.status(HTTP_OK_STATUS).json([]);
  return response.status(HTTP_OK_STATUS).json(data);
});

app.get('/talker/:id', async (request, response, _next) => {
  const { id } = request.params;
  const data = await readFile();
  const foundPerson = data.find((person) => person.id === Number(id));
  if (!foundPerson) {
    return response.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  return response.status(HTTP_OK_STATUS).json(foundPerson);
});

app.post('/login', async (request, response, _next) => {
  const { email, password } = request.body;
  const token = generateToken();
  console.log(email, password);
  console.log(token);
  if (email && password) {
    return response.status(HTTP_OK_STATUS).json({ token });
  };
  return response.status(400).json('algo de errado n está certo')
})

app.listen(PORT, () => {
  console.log('Online');
});
