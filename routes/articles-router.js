const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticle,
  patchArticle
} = require('../controllers/articles-controllers');
const { postComment, getComments } = require('../controllers/comments-controllers');

articlesRouter.route('/')
  .get(getArticles)

articlesRouter.route('/:article_id')
  .get(getArticle)
  .patch(patchArticle);

articlesRouter.route('/:article_id/comments')
  .post(postComment)
  .get(getComments);

module.exports = articlesRouter;