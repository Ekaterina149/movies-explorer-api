const { celebrate, Joi } = require('celebrate');
const { linkPattern } = require('../utils/constants');

const createUserJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),

  }),
});

const updateUserJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
  }),
});

const createMovieJoi = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().trim(),
    director: Joi.string().required().trim(),
    duration: Joi.number().integer().min(0).required(),
    year: Joi.string().required().trim(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(linkPattern),
    trailerLink: Joi.string().required().pattern(linkPattern),
    thumbnail: Joi.string().required().pattern(linkPattern),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().trim(),
    nameEN: Joi.string().required().trim(),
  }),
});

const checkMovieIdJoi = celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
});

const loginUserJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),

  }),
});

module.exports = {

  createUserJoi,
  createMovieJoi,
  checkMovieIdJoi,
  loginUserJoi,
  updateUserJoi,

};
