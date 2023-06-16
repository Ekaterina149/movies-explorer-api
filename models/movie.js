/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      validate: {
        validator(v) {
          if ((v === '') || ((v.match(/\s/g) !== null) && (v.match(/\s/g).length === v.length))
          ) {return false;}

          return validator.isAlpha(v, 'ru-RU');
        },
        message: 'Введите название страны на русском языке, цифры недопустимы',
      },
      required: true,

    },
    director: {
      type: String,
      validate: {
        validator(v) {
          if ((v === '') || ((v.match(/\s/g) !== null) && (v.match(/\s/g).length === v.length))
          ) return false;

          return validator.isAlpha(v, 'ru-RU', { ignore: ' ' });
        },
        message: 'Введите имя режиссера на русском языке, цифры недопустимы',
      },
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      validate: {
        validator(v) {
          const regex = /^\d+$/;
          return regex.test(v);
        },
        message: 'Введите год создания фильма без пробелов, буквы недопустимы',

      },
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      validate: {
        validator(v) {
          return validator.isURL(v, {
            require_protocol: true,
            require_valid_protocol: true,
            require_host: true,
          });
        },
        message: 'Введите корректную ссылку на постер к фильму',
      },
      required: true,
    },

    trailerLink: {
      type: String,
      validate: {
        validator(v) {
          return validator.isURL(v, {
            require_protocol: true,
            require_valid_protocol: true,
            require_host: true,
          });
        },
        message: 'Введите корректную ссылку на трейлер к фильму',
      },
      required: true,
    },
    thumbnail: {
      type: String,
      validate: {
        validator(v) {
          return validator.isURL(v, {
            require_protocol: true,
            require_valid_protocol: true,
            require_host: true,
          });
        },
        message: 'Введите корректную ссылку миниатюрное изображение постера  к фильму',
      },
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      validate: {
        validator(v) {
          if ((v === '') || ((v.match(/\s/g) !== null) && (v.match(/\s/g).length === v.length))
          ) return false;

          return validator.isAlphanumeric(v, 'ru-RU', { ignore: ' -,&!"":%#№@'  });
        },
        message: 'Введите название фильма на русском языке',
      },
      required: true,
    },
    nameEN: {
      type: String,
      validate: {
        validator(v) {
          if ((v === '') || ((v.match(/\s/g) !== null) && (v.match(/\s/g).length === v.length))
          ) return false;

          return validator.isAlphanumeric(v, 'en-US', { ignore: "/[%#№@&?,:'\s]/" });
        },
        message: 'Введите название фильма на английском языке',
      },
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

  },
  {
    versionKey: false,
  },
);
module.exports = mongoose.model('movie', movieSchema);
