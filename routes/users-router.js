const usersRouter = require('express').Router();
const {getUser} = require('../controllers/users-controllers');

usersRouter.get('/:username', getUser)

module.exports = usersRouter;