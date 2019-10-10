const usersRouter = require('express').Router();
const {getUser, getUsers} = require('../controllers/users-controllers');
const {methodError} = require('../errors/error-handlers')


usersRouter.route('/')
  .get(getUsers)
  .all(methodError);

usersRouter.route('/:username')
  .get(getUser)
  .all(methodError);

module.exports = usersRouter;