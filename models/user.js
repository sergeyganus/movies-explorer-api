const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AuthenticationError = require('../errors/AuthenticationError');
const { emailRegExp } = require('../utils/regexps');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле email должно быть заполнено'],
    unique: [true, 'Поле email не должно повторяться'],
    validate: {
      validator: (email) => emailRegExp.test(email),
      message: 'Некорректный адрес эл. почты для поля email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле password должно быть заполнено'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Поле name должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля name - 2 символа'],
    maxlength: [30, 'Максимальная длина поля name - 30 символов'],
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthenticationError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthenticationError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
