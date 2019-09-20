const express = require('express');
const apiRouter = require('./routes/api-router');
const {handlePsqlErrors, handleCustomErrors} = require('./errors/error-handlers')

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use('*', (req, res, next) => {
  next({status: 404, msg: 'Page not found'})
})

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;