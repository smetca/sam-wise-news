const connection = require('../connection');

exports.selectAllTopics = () => {
  return connection
    .select('slug', 'description')
    .from('topics')
}