const connection = require('../connection');

exports.selectArticles = (sortBy = 'created_at', orderBy = 'asc', author, topic) => {
  console.log('here2');
  return connection
    .select('articles.*')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count('comment_id AS comment_count')
    .modify((myQuery) => {
      if(author) myQuery.where('articles.author', author);
      if(topic) myQuery.where({topic});
    })
    .orderBy(sortBy, orderBy)
}

exports.selectArticle = (article_id) => {
  console.log(article_id);
  return connection
    .select('articles.*')
    .from('articles')
    .where('articles.article_id', article_id)
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count('comment_id AS comment_count')
    .then(([article]) => {
      return !article ? Promise.reject({status: 404, msg: 'Not Found'}) : article;
    });
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