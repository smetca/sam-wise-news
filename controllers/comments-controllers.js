const {
  insertCommentByArticle,
  selectCommentsByArticle,
  updateCommentById,
  removeCommentById
} = require('../models/comments-models')

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

exports.patchComment = (req, res, next) => {
  const {comment_id} = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then(comment => {
      res.status(200).json({comment});
    })
    .catch(next);
}

exports.deleteComment = (req, res, next) => {
  const {comment_id} = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
}