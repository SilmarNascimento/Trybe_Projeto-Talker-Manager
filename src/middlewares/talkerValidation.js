const ageValidation = (request, response, next) => {
  const { age } = request.body;
  if (!age) {
    return response.status(400).json({
      message: 'O campo "age" é obrigatório',
    });
  }
  if (!Number.isInteger(age) || age < 18) {
    return response.status(400).json({
      message: 'O campo "age" deve ser um número inteiro igual ou maior que 18',
    });
  }
  next();
};

const namevalidation = (request, response, next) => {
  const { name } = request.body;
  if (!name) {
    return response.status(400).json({
      message: 'O campo "name" é obrigatório',
    });
  }
  if (name.length < 3) {
    return response.status(400).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  }
  next();
};

const watchedAtValidation = (request, response, next) => {
  const { talk: { watchedAt } } = request.body;
  if (!watchedAt) {
    return response.status(400).json({
      message: 'O campo "watchedAt" é obrigatório',
    });
  }
  const regexData = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (!regexData.test(watchedAt)) {
    return response.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }
  next();
};

const rateValidation = (request, response, next) => {
  const { talk: { rate } } = request.body;
  if (rate === undefined) {
    return response.status(400).json({
      message: 'O campo "rate" é obrigatório',
    });
  }
  if (!Number.isInteger(rate) || rate <= 0 || rate > 5) {
    return response.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  next();
};

const talkValidation = (request, response, next) => {
  const { talk } = request.body;
  if (!talk) {
    return response.status(400).json({
      message: 'O campo "talk" é obrigatório',
    });
  }
  next();
};

module.exports = {
  namevalidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation,
};
