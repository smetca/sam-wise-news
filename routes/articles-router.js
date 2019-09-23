const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticle,
  patchArticle
} = require('../controllers/articles-controllers');
const { postComment, getComments } = require('../controllers/comments-controllers');
const { methodError } = require('../errors/error-handlers');

articlesRouter.route('/')
  .get(getArticles)
  .all(methodError);

articlesRouter.route('/:article_id')
  .get(getArticle)
  .patch(patchArticle)
  .all(methodError);

articlesRouter.route('/:article_id/comments')
  .post(postComment)
  .get(getComments)
  .all(methodError);

module.exports = articlesRouter;