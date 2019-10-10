const {selectUser, selectUsers} = require('../models/users-models');

exports.getUser = (req, res, next) => {
  const {username} = req.params;
  selectUser(username)
    .then(user => {
      res.status(200).json({user});
    })
    .catch(next);
}

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then(users => {
      res.status(200).json({users});
    })
    .catch(next);
}