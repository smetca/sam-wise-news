const usersRouter = require('express').Router();
const {getUser} = require('../controllers/users-controllers');
const {methodError} = require('../controllers/api-controllers')

usersRouter.route('/:username')
  .get(getUser)
  .all(methodError);

module.exports = usersRouter;