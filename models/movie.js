const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, 'поле "country" не может быть пустым'],

    },
    director: {
      type: String,
      required: [true, 'поле "director" не может быть пустым'],
    },
    duration: {
      type: Number,
      required: [true, 'поле "duration" не может быть пустым'],
    },
    year: {
      type: String,
      required: [true, 'поле "year" не может быть пустым'],
    },
    description: {
      type: String,
      required: [true, 'поле "description" не может быть пустым'],
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
      required: [true, 'поле "image" не может быть пустым'],
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
      required: [true, 'поле "trailerLink" не может быть пустым'],
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
      required: [true, 'поле "thumbnail" не может быть пустым'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'поле "owner" не может быть пустым'],
    },
    movieId: {
      type: Number,
      required: [true, 'поле "movieId" не может быть пустым'],
    },
    nameRU: {
      type: String,
      required: [true, 'поле "nameRU" не может быть пустым'],
    },
    nameEN: {
      type: String,
      required: [true, 'поле "nameEN" не может быть пустым'],
    },

  },
  {
    versionKey: false,
  },
);
// задаем составной индекс, для блокировки повторного сохранения фильма пользователем
movieSchema.index({ owner: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('movie', movieSchema);
