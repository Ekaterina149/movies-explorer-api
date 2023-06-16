/* eslint-disable no-unused-vars */
const router = require('express').Router();
const routerUsers = require('./routesUsers');
const routerMovies = require('./routesMovies');
const { createUser, login } = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundError');
const { createUserJoi, loginUserJoi } = require('../middlewares/JoiValidation');
// роуты, не требующие авторизации
router.post('/signin', loginUserJoi, login);
router.post('/signup', createUserJoi, createUser);
router.use(authMiddleware);
router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});
router.use('/users', routerUsers);
router.use('/movies', routerMovies);
router.use((req, res) => {
  throw new NotFoundError("Sorry can't find that!");
});
module.exports = router;
