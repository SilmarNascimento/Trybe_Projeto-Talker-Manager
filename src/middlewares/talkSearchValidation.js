const { readFile } = require('../utils/fs');

const searchTermValidation = async (request, response, next) => {
  const { q: searchTerm } = request.query;
  const speakers = await readFile();
  if (!searchTerm) {
  return response.status(200).json(speakers);
  }
  const speakerFound = speakers.filter((speaker) => speaker.name.includes(searchTerm));
  if (!speakerFound) {
    return response.status(200).json();
  }
  next();
};

const rateValidation = async (request, response, next) => {
  const { rate } = request.query;
  const speakers = await readFile();
  if (!Number.isInteger(rate) || rate <= 0 || rate > 5) {
  return response.status(400).json({
    message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
  });
  }
  const speakerFound = speakers.filter(({ talk }) => talk.rate === Number(rate));
  if (!speakerFound) {
    return response.status(200).json();
  }
  next();
};

const dateValidation = async (request, response, next) => {
  const { rate } = request.query;
  const speakers = await readFile();
  if (!rate) {
  return response.status(200).json(speakers);
  }
  const speakerFound = speakers.filter(({ talk }) => talk.rate === Number(rate));
  if (!speakerFound) {
    return response.status(200).json();
  }
  next();
};

module.exports = {
  searchTermValidation,
  rateValidation,
  dateValidation,
};