const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const DuplicationError = require('../errors/DuplicationError');
const { OK_STATUS_CODE } = require('../utils/statusCodes');
const User = require('../models/user');

module.exports.getUserProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Пользователя с указанным _id не существует'))
    .then((user) => res.status(OK_STATUS_CODE).send(user))
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователя с указанным _id не существует'))
    .then((user) => res.status(OK_STATUS_CODE).send(user))
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
};
