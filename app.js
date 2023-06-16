require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes');

const app = express();
// eslint-disable-next-line import/no-extraneous-dependencies
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleErrors } = require('./middlewares/handleErrors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1/bitfilmsdb ', {
  useNewUrlParser: true,
});
app.use(requestLogger);
app.use(helmet());

app.use(cors({ origin: ['http://localhost:3001'], credentials: true }));
// корневой роут
app.use(router);
app.use(errorLogger);
app.use(errors({ message: 'Ошибка валидации Joi!' }));
app.use(handleErrors);
const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
