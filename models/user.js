const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длина поля "name" -2'],
      maxlength: [30, 'Максимальная длина поля "name" -30'],

    },

    email: {
      type: String,
      validate: {
        validator(v) {
          return validator.isEmail(v, { allow_utf8_local_part: false });
        },
        message: 'Введите корректную почту',
      },
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);
module.exports = mongoose.model('user', userSchema);
