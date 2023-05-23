require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const authRouter = require('./auth/auth-router');
const userRouter = require('./user/user-router');
const membersAuthRouter = require('./auth-members/members-auth');
const membersRouter = require('./members/members-router')

const householdsRouter = require('./households/households-router');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

let whitelist = ['https://chore-runner-client.vercel.app/', 'https://chore-runner-client.vercel.app']
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hallo, Textbaustein!');
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/households', householdsRouter);
app.use('/api/membersAuth', membersAuthRouter);
app.use('/api/members', membersRouter)

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
