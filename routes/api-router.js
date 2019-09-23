const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const {getHomepage} = require('../controllers/api-controllers')
const {methodError} = require('../errors/error-handlers');


apiRouter.route('/')
  .get(getHomepage)
  .all(methodError)

apiRouter.use('/topics', topicsRouter)
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;