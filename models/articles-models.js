const connection = require('../connection');

exports.selectArticles = (sortBy = 'created_at', orderBy = 'desc', author, topic) => {
  return connection
    .select('articles.*')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count('comment_id AS comment_count')
    .modify((myQuery) => {
      if(author) myQuery.where('articles.author', author);
      if(topic) myQuery.where('articles.topic', topic);
    })
    .orderBy(sortBy, orderBy)
    .then(articles => {
      return !articles.length ? Promise.reject({status: 404, msg: 'Not Found'}) : articles;
    })
}

exports.selectArticle = (article_id) => {
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
}