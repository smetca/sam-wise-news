const usersRouter = require('express').Router();
const {getUser} = require('../controllers/users-controllers');
const {methodError} = require('../errors/error-handlers')

usersRouter.route('/:username')
  .get(getUser)
  .all(methodError);

module.exports = usersRouter;