const endpoints = require('../endpoints.json')

exports.getHomepage = (req, res, next) => {
  res.status(200).json({endpoints});
}