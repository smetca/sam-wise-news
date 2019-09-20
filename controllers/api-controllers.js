const endpoints = require('../endpoints.json')

exports.getHomepage = (req, res, next) => {
  console.log(endpoints);
  res.status(200).json({endpoints});
}

exports.methodError = (req, res, next) => {
  res.status(405).json({msg: 'method not allowed'})
}