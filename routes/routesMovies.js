const routerMovies = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,

} = require('../controllers/movies');

// const { createCardJoi, checkCardIdJoi } = require('../middlewares/JoiValidation');

routerMovies.get('', getMovies);
routerMovies.post('', createMovie);
routerMovies.delete('/:movieId', deleteMovie);

module.exports = routerMovies;
