const {selectAllTopics} = require('../models/topics-models')

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then(topics => {
      res.status(200).json({topics});
    })
    .catch(console.log);
}