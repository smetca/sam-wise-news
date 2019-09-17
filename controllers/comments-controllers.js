const {insertComment} = require('../models/comments-models')

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  insertComment(article_id, comment)
    .then(comment => {
      res.status(200).json({comment});
    })
    .catch(next)
}

exports.getComment = (req, res, next) => {
  const { article_id } = req.params;

  selectComment(article_id)
    .then(comment => {
      res.status(200).json({comment})
    })
    .catch(next);

}