const connection = require('../connection');

exports.insertComment = (article_id, comment) => {

  const commentObj = {
    author: comment.username,
    article_id: article_id,
    votes: 0,
    created_at: new Date(Date.now()),
    body: comment.body
  }

  return connection
    .insert(commentObj)
    .into('comments')
    .returning('*')
    .then(([comment]) => comment);
}