const mongoose = require('mongoose');
const NotFoundError = require('../errors/NotFoundError');
const { urlRegExp } = require('../utils/regexps');

const movieSchema = mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле country должно быть заполнено'],
  },
  director: {
    type: String,
    required: [true, 'Поле director должно быть заполнено'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле duration должно быть заполнено'],
  },
  year: {
    type: String,
    required: [true, 'Поле year должно быть заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле description должно быть заполнено'],
  },
  image: {
    type: String,
    required: [true, 'Поле image должно быть заполнено'],
    validate: {
      validator: (image) => urlRegExp.test(image),
      message: 'Некорректный URL-адрес для поля image',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Поле trailerLink должно быть заполнено'],
    validate: {
      validator: (trailerLink) => urlRegExp.test(trailerLink),
      message: 'Некорректный URL-адрес для поля trailerLink',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле thumbnail должно быть заполнено'],
    validate: {
      validator: (thumbnail) => urlRegExp.test(thumbnail),
      message: 'Некорректный URL-адрес для поля thumbnail',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: [true, 'Поле movieId должно быть заполнено'],
  },
  nameRU: {
    type: String,
    required: [true, 'Поле nameRU должно быть заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле nameEN должно быть заполнено'],
  },
}, { versionKey: false });

movieSchema.statics.findMovieById = function (movieId) {
  return this.findById(movieId)
    .orFail(() => new NotFoundError('Фильма с указанным _id не существует'))
    .then((movie) => movie);
};

module.exports = mongoose.model('movie', movieSchema);
