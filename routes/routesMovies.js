const routerMovies = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,

} = require('../controllers/movies');

const { createMovieJoi, checkMovieIdJoi } = require('../middlewares/JoiValidation');

routerMovies.post('', createMovieJoi, createMovie);
routerMovies.get('', getMovies);
routerMovies.delete('/:movieId', checkMovieIdJoi, deleteMovie);

module.exports = routerMovies;
