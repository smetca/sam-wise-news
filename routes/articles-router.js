const articlesRouter = require('express').Router();
const {getArticle} = require('../controllers/articles-controllers');

articlesRouter.get('/:article_id', getArticle)

module.exports = articlesRouter;