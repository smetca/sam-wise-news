const connection = require('../connection');

exports.insertCommentByArticle = (article_id, comment) => {

  const commentObj = {
    author: comment.username,
    article_id: article_id,
    votes: 0,
    created_at: new Date(Date.now()),
    body: comment.body
  }

  return connection
    .select('*')
    .from('articles')
    .where({article_id})
    .then((article) => {
      if(!article.length) return Promise.reject({code: '22P02'});
      return connection
        .insert(commentObj)
        .into('comments')
        .returning('*')
    })
    .then(([comment]) => comment)
    .catch(err => {
      return err.code === '22P02' ? Promise.reject({status: 422, msg: 'Unprocessable Entity'})
        : Promise.reject(err);
    })
}

exports.selectCommentsByArticle = (article_id, sortBy = 'created_at', orderBy = 'asc') => {

  return connection
    .select('*')
    .from('comments')
    .where({article_id})
    .orderBy(sortBy, orderBy)
    .then(comments => {
      return !comments.length ? Promise.reject({status: 404, msg: 'Not Found'}) : comments;
    })
}