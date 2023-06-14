const httpConstants = require('http2').constants;
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const Movie = require('../models/movie');

const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} = httpConstants;
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id }).sort({ createdAt: -1 })
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
    .catch((err) => next(err));
};
module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;
  Movie.create({ name, link, owner: req.user._id })
    .then((movie) => res.status(HTTP_STATUS_CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // eslint-disable-next-line no-shadow
        const {
          country, director, year,
          description, image, trailerLink, thumbnail, owner, movieId, nameRU, nameEN,
        } = err.errors;
        const errArray = [
          country, director, year,
          description, image, trailerLink, thumbnail, owner, movieId, nameRU, nameEN];
        const messages = (errArray.filter((element) => element).map((element, index) => (`№${index + 1}. ${element.message}`))).join(', ');
        return next(new BadRequestError(messages.length ? messages : 'Переданы некорректные данные при создании фильма'));
      }
      return next(err);
    });
};
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail()
    .then((movie) => {
      if (String(movie.owner) !== String(req.user._id)) {
        throw new ForbiddenError('Недостаточно прав для удаления');
      }
      return movie.deleteOne();
    })
    .then((movie) => res.status(HTTP_STATUS_OK).send(movie))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Фильм с указанным _id не найден.'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при удалении фильма.'));
      }

      return next(err);
    });
};