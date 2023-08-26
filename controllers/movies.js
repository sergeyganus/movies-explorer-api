const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const { OK_STATUS_CODE, CREATED_STATUS_CODE } = require('../utils/statusCodes');
const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(OK_STATUS_CODE).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(CREATED_STATUS_CODE).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка валидации переданных данных'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { _id } = req.params;

  Movie.findMovieById(_id)
    .then((findedMovie) => {
      if (req.user._id === findedMovie.owner.toString()) {
        Movie.findByIdAndDelete(_id)
          .then((movie) => {
            res.status(OK_STATUS_CODE).send(movie);
          })
          .catch(next);
      } else {
        next(new ForbiddenError('У вас недостаточно прав, чтобы удалить фильм с указанным _id'));
      }
    })
    .catch(next);
};
