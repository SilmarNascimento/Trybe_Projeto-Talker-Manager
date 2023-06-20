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

const rateSearchValidation = async (request, response, next) => {
  if (request.query.rate) {
    const rate = Number(request.query.rate);
    if (!Number.isInteger(rate) || rate <= 0 || rate > 5) {
      return response.status(400).json({
        message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
      });
    }
  }
  next();
};

const dateSearchValidation = async (request, response, next) => {
  const { date } = request.query;
  if (date) {
    const regexData = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
    if (!regexData.test(date)) {
      return response.status(400).json({
        message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"',
      });
    }
  }
  next();
};

module.exports = {
  searchTermValidation,
  rateSearchValidation,
  dateSearchValidation,
};