const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const DuplicationError = require('../errors/DuplicationError');
const { OK_STATUS_CODE, CREATED_STATUS_CODE } = require('../utils/statusCodes');
const { DEV_SECRET } = require('../utils/constants');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((user) => res.status(CREATED_STATUS_CODE).send({
          email: user.email,
          name: user.name,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Произошла ошибка валидации переданных данных'));

            return;
          }

          if (err.code === 11000) {
            next(new DuplicationError('Пользователь с данным email уже существует'));

            return;
          }

          next(err);
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET,
        { expiresIn: '7d' },
      );

      res
        .status(OK_STATUS_CODE)
        .cookie('jwt', `Bearer ${token}`, {
          maxAge: 3600000 * 24 * 2,
          httpOnly: true,
        })
        .send({ message: `Пользователь ${email} успешно авторизован!` });
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  try {
    res.clearCookie('jwt');
    res.status(OK_STATUS_CODE).send({ message: 'Куки успешно очищены' });
  } catch (err) {
    next(err);
  }
};
