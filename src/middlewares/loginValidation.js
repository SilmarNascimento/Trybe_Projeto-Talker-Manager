const emailValidation = async (request, response, next) => {
  const { email } = request.body;
  const regex = /\S+@\S+\.\S+/;
  if (!email) {
    return response.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  } if (!regex.test(email)) {
    return response.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }
  next();
};

const passwordValidation = async (request, response, next) => {
  const { password } = request.body;
  if (!password) {
    return response.status(400).json({
      message: 'O campo "password" é obrigatório',
    });
  } if (password.length < 6) {
    return response.status(400).json({
      message: 'O "password" deve ter pelo menos 6 caracteres',
    });
  }
  next();
};

module.exports = {
  emailValidation,
  passwordValidation,
};
