const connection = require('../connection');

exports.selectArticle = (article_id) => {
  console.log(article_id);
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
        console.log(article);
        article.comment_count = commentsForArticle.length;
        return article;
    })
}

exports.updateArticleVotes = (article_id, newVotes) => {
  return connection
    .select('votes')
    .from('articles')
    .where({article_id})
    .then(([{votes}]) => {
      votes += newVotes
      return connection
        .update({votes})
        .from('articles')
        .where({article_id})
        .returning('*');
    })
    .then(updatedArticles => {
      console.log(updatedArticles);
      return updatedArticles;
    })
}