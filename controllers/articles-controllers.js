const {selectArticle, updateArticleVotes} = require('../models/articles-models');

exports.getArticle = (req, res, next) => {
  const {article_id} = req.params;
  selectArticle(article_id)
    .then(article => {
      console.log(article);
      res.status(200).json({article});
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