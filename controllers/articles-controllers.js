const {selectArticle} = require('../models/articles-models');

exports.getArticle = (req, res, next) => {
  const {article_id} = req.params;
  selectArticle(article_id)
    .then(article => {
      console.log('here');
      res.status(200).json({article});
    })
    .catch(next);
}