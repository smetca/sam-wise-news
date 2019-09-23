const commentsRouter = require('express').Router();
const {patchComment, deleteComment} = require('../controllers/comments-controllers')
const {methodError} = require('../errors/error-handlers')

commentsRouter.route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all(methodError)

module.exports = commentsRouter;