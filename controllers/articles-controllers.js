const {selectArticles, selectArticle, updateArticleVotes} = require('../models/articles-models');

exports.getArticle = (req, res, next) => {
  const {article_id} = req.params;
  selectArticle(article_id)
    .then(article => {
      res.status(200).json({article});
    })
    .catch(next);
}

exports.getArticles = (req, res, next) => {

  const {sortBy, orderBy, author, topic} = req.query;

  selectArticles(sortBy, orderBy, author, topic)
    .then(articles => {
      res.status(200).json({articles})
    })
    .catch(next);
}

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes)
    .then(([article]) => {
      res.status(200).json({article});
    })
    .catch(next);
}