const {selectUser} = require('../models/users-models');

exports.getUser = (req, res, next) => {
  const {username} = req.params;
  selectUser(username)
    .then(user => {
      res.status(200).json({user});
    })
    .catch(next);
}