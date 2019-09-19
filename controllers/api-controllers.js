exports.getHomepage = (req, res, next) => {
  const routes = {
    '/api/topics': 'GET',
    '/api/users/:username': 'GET',
    '/api/articles/:article_id': 'GET, PATCH',
    '/api/articles': 'GET'
  }
}

exports.methodError = (req, res, next) => {
  res.status(405).json({msg: 'method not allowed'})
}