const dotenv = require('dotenv').config();
const express = require('express');
const https = require('https');
const logger = require('morgan');
const path = require('path');
const fs = require('fs');
const { auth } = require('express-openid-connect');

const key = fs.readFileSync('./localhost-key.pem');
const cert = fs.readFileSync('./localhost.pem');

// dotenv.load();

const app = express();

const configAuth = {
  required: false,
  auth0Logout: true,
  appSession: {
    secret: 'a long, randomly-generated string stored in env'
  },
  baseURL: 'https://localhost:3000',
  clientID: '3voOkhCijKjDAHv2i75KJZwCwTLHst2W5',
  issuerBaseURL: 'dev-9tabcska.auth0.com'
};

//Declaring port
const port = process.env.PORT || 3000;
if (!configAuth.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `https://localhost:${port}`;
}


app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(configAuth));


// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.openid.user;
  next();
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {}
  });
});

// https.createServer({key, cert}, app)
//   .listen(port, () => {
//     console.log(`Listening on ${configAuth.baseURL}`);
// });

app.listen(port, function() {
  console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", port, port);
});