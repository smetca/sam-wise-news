const connection = require('../connection');

exports.selectArticle = (article_id) => {
  return connection
    .select('*')
    .from('articles')
    .where({article_id})
    .then(([article]) => {
      if(!article) {
        return Promise.reject({status: 404, msg: 'Not Found'});
      }
      const commentsForArticle = connection
        .select('comment_id')
        .from('comments')
        .where({article_id});
      return Promise.all([article, commentsForArticle])
    })
    .then(([article, commentsForArticle]) => {
      article.comment_count = commentsForArticle.length;
      return article;
    })
}