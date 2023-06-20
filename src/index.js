const express = require('express');
const { readFile, writeFile } = require('./utils/fs');
const generateToken = require('./utils/generateToken');
const authorization = require('./middlewares/authorization');
const {
  namevalidation,
  ageValidation,
  talkValidation,
  rateValidation,
  watchedAtValidation,
} = require('./middlewares/talkerValidation');
const { emailValidation, passwordValidation } = require('./middlewares/loginValidation');
const {
  rateSearchValidation,
  dateSearchValidation,
} = require('./middlewares/talkSearchValidation');

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

const rateFilter = (array, filter) => array.filter(({ talk }) => talk.rate === Number(filter));

const dateFilter = (array, filter) => array.filter(({ talk }) => talk.watchedAt === filter);

const aditionalFIlters = (propArray, lastFilter) => {
  let response = [...lastFilter];
  propArray.forEach((prop, index) => {
    if (propArray[0] && index === 0) {
      response = rateFilter(response, prop);
    }
    if (propArray[1] && index === 1) {
      response = dateFilter(response, prop);
    }
  });
  return response;
};

app.get('/talker/search',
  authorization,
  rateSearchValidation,
  dateSearchValidation,
  async (request, response) => {
  const { q: searchTerm, rate, date } = request.query;
  const searchProperties = [rate, date];
  const speakers = await readFile();
  let lastFilter = [...speakers];
  if (searchTerm) {
    lastFilter = speakers.filter((speaker) => speaker.name.includes(searchTerm));
  }
  lastFilter = aditionalFIlters(searchProperties, lastFilter);
  return response.status(200).json(lastFilter);
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

app.post('/login',
  emailValidation,
  passwordValidation,
  async (request, response, _next) => {
  const token = generateToken();
  request.headers.authorization = token;
  return response.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker',
  authorization,
  namevalidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation,
  async (request, response, _next) => {
  const speakers = await readFile();
  speakers.sort((a, b) => a.id - b.id);
  const nextId = speakers[speakers.length - 1].id + 1;

  const lastSpeaker = {
    id: nextId,
    ...request.body,
  };
  const newSpeakers = [
    ...speakers,
    lastSpeaker,
  ];
  await writeFile(newSpeakers);

  return response.status(201).json(lastSpeaker);
});

app.put('/talker/:id',
  authorization,
  namevalidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation,
  async (request, response, _next) => {
  const { id } = request.params;
  const speakers = await readFile();
  const speakerFound = speakers.find((speaker) => speaker.id === Number(id));
  if (!speakerFound) {
    return response.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  const updatedData = { id: Number(id), ...request.body };
  const updatedSpeakers = speakers.reduce((acc, crr) => {
    if (crr.id === Number(id)) {
      return [...acc, updatedData];
    }
    return [...acc, crr];
  }, []);
  await writeFile(updatedSpeakers);
  return response.status(200).json(updatedData);
});

app.delete('/talker/:id', authorization, async (resquest, response) => {
  const { id } = resquest.params;
  const speakers = await readFile();
  const speakerFound = speakers.find((speaker) => speaker.id === Number(id));
  if (!speakerFound) {
    return response.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  const updatedSpeakers = speakers.reduce((acc, crr) => {
    if (crr.id === Number(id)) {
      return [...acc];
    }
    return [...acc, crr];
  }, []);
  await writeFile(updatedSpeakers);
  return response.status(204).json();
});

app.listen(PORT, () => {
  console.log('Online');
});
