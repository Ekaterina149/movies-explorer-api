const routerUsers = require('express').Router();

// const Card = require('../models/user');
const {
  getUsers,
  updateUser,
  getCurrentUser,
} = require('../controllers/users');

const { updateUserJoi } = require('../middlewares/JoiValidation');

routerUsers.get('', getUsers);
routerUsers.get('/me', getCurrentUser);
routerUsers.patch('/me', updateUserJoi, updateUser);

module.exports = routerUsers;
