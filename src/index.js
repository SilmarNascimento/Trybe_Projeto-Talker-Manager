const express = require('express');
const { readFile, writeFile } = require('./utils/fs');
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

app.post('/talker', async (request, response,_next) => {
  const speakers = await readFile();
  speakers.sort((a, b) => a.id - b.id);
  const nextId = speakers[speakers.length - 1].id + 1;
  console.log(nextId);
  const token = request.headers.authorization;
  if (!token) {
    return response.status(401).json({
      message: 'Token não encontrado',
    });
  }
  if (token.length !== 16 || typeof token !== 'string') {
    return response.status(401).json({
      message: 'Token inválido',
    });
  }
  const { name, age, talk } = request.body;
  if (!name) {
    return response.status(400).json({
      message: 'O campo \"name\" é obrigatório',
    });
  }
  if (name.length < 3) {
    return response.status(400).json({
      message: 'O \"name\" deve ter pelo menos 3 caracteres',
    });
  }

  if (!age) {
    return response.status(400).json({
      message: 'O campo \"age\" é obrigatório',
    });
  }
  if (!Number.isInteger(age) || age < 18) {
    return response.status(400).json({
      message: 'O campo \"age\" deve ser um número inteiro igual ou maior que 18',
    });
  }

  if (!talk) {
    return response.status(400).json({
      message: 'O campo \"talk\" é obrigatório',
    });
  }
  const { watchedAt, rate } = talk;
  if (!watchedAt) {
    return response.status(400).json({
      message: 'O campo \"watchedAt\" é obrigatório',
    });
  }
  const regexData = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (!regexData.test(watchedAt)) {
    return response.status(400).json({
      message: 'O campo \"watchedAt\" deve ter o formato \"dd/mm/aaaa\"',
    });
  }

  if (rate === undefined) {
    return response.status(400).json({
      message: 'O campo \"rate\" é obrigatório',
    });
  }
  if (!Number.isInteger(rate) || rate <= 0 || rate > 5) {
    return response.status(400).json({
      message: 'O campo \"rate\" deve ser um número inteiro entre 1 e 5',
    });
  }

  const lastSpeaker = {
    id: nextId,
    ...request.body,
  };
  const newSpeakers = [
    ...speakers,
    lastSpeaker
  ];
  await writeFile(newSpeakers);

  return response.status(201).json(lastSpeaker);
});

app.post('/login', async (request, response, _next) => {
  const { email, password } = request.body;
  const regex = /\S+@\S+\.\S+/;
  if (!email) {
    return response.status(400).json({
      message: 'O campo \"email\" é obrigatório',
    });
  } else if (!regex.test(email)) {
    return response.status(400).json({
      message: 'O \"email\" deve ter o formato \"email@email.com\"',
    });
  }
  if (!password) {
    return response.status(400).json({
      message: 'O campo \"password\" é obrigatório',
    });
  } else if(password.length < 6) {
    return response.status(400).json({
      message: 'O \"password\" deve ter pelo menos 6 caracteres',
    });
  };
  const token = generateToken();
  request.headers.authorization = token;
  return response.status(HTTP_OK_STATUS).json({ token });
})

app.listen(PORT, () => {
  console.log('Online');
});
