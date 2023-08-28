const jwt = require('jsonwebtoken');
const AuthenticationError = require('../errors/AuthenticationError');
const { DEV_SECRET } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthenticationError('Ошибка аутентификации пользователя'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET);
  } catch (err) {
    return next(new AuthenticationError('Ошибка аутентификации пользователя'));
  }

  req.user = payload;

  return next();
};
