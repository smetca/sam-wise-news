const connection = require('../connection');

const doesTopicExist = (topic) => {
  if(!topic) return false;
  else {
    return connection
      .select('*')
      .from('topics')
      .where({slug: topic})
      .then(topics => {
        if(!topics.length) return Promise.reject({status: 404, msg: 'Topic doesn\'t exist'});
        else return true;
      })
  }
}

const doesAuthorExist = (author) => {
  if(!author) return false;
  else {
    return connection
      .select('*')
      .from('users')
      .where({username: author})
      .then(authors => {
        if(!authors.length) return Promise.reject({status: 404, msg: 'Author doesn\'t exist'})
        else return true
      })
  }
}

exports.selectArticles = (sortBy = 'created_at', orderBy = 'desc', author, topic, limit = 4, p = 1) => {
  if(!['asc', 'desc'].includes(orderBy)) return Promise.reject({status: 400, msg: 'Invalid Order Query'})
  
  const authorTopicModify = (myQuery) => {
    if(author) myQuery.where('articles.author', author);
    if(topic) myQuery.where('articles.topic', topic);
  }

  return connection
    .select('articles.*')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count('comment_id AS comment_count')
    .modify(authorTopicModify)
    .orderBy(sortBy, orderBy)
    .limit(limit)
    .offset((p-1)*limit)
    .then(articles => {
      const allFilteredArticles = connection
        .select('articles.article_id')
        .from('articles')
        .modify(authorTopicModify)
      return !articles.length ? Promise.all([articles, allFilteredArticles, doesTopicExist(topic), doesAuthorExist(author)]) : Promise.all([articles, allFilteredArticles]);
    })
    .then(([articles, allFilteredArticles]) => {
      return Promise.all([articles, allFilteredArticles.length]);
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