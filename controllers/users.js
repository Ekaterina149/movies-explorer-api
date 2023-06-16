/* eslint-disable no-shadow */
const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../errors/authError');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

// const {
//   HTTP_STATUS_BAD_REQUEST,
//   HTTP_STATUS_NOT_FOUND,
//   HTTP_STATUS_INTERNAL_SERVER_ERROR,
// } = httpConstants;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id пользователя'));
      }

      return next(err);
    });
};
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 12)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const deletePasswordUser = user.toObject({ useProjection: true });
      return res.send(deletePasswordUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const {
          email, name, password,
        } = err.errors;
        const errArray = [email, name, password];
        const messages = (errArray.filter((element) => element).map((element, index) => (`№${index + 1}. ${element.message}`))).join(', ');
        return next(new BadRequestError(messages.length ? messages : 'Переданы некорректные  данные пользователя'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Такой email уже есть в базе'));
      }
      return next(err);
    });
};
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
      if (err.name === 'ValidationError') {
        const { name, email } = err.errors;
        const errArray = [name, email];
        const messages = (errArray.filter((element) => element).map((element, index) => (`№${index + 1}. ${element.message}`))).join(', ');
        return next(new BadRequestError(messages.length ? messages : 'Переданы некорректные данные при обновлении профиля'));
      }

      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new AuthError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new AuthError('Неправильные почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });

          res.cookie('jwt', token, {

            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней в миллисекундах
            httpOnly: true,
          });

          return res.send(user.toJSON());
        });
    })
    .catch((err) => next(err));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }

      return next(err);
    });
};
