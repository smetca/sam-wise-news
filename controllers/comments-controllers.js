const {insertCommentByArticle, selectCommentsByArticle} = require('../models/comments-models')

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  insertCommentByArticle(article_id, comment)
    .then(comment => {
      res.status(201).json({comment});
    })
    .catch(next)
}

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sortBy, orderBy } = req.query;
  selectCommentsByArticle(article_id, sortBy, orderBy)
    .then(comments => {
      res.status(200).json({comments})
    })
    .catch(next);
}