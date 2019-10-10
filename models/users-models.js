const connection = require('../connection');

exports.selectUser = (username) => {
  return connection
    .select('*')
    .from('users')
    .where({username})
    .then(([user]) => {
      return !user ? Promise.reject({status: 404, msg: 'Not Found'}) : user;
    });
}

exports.selectUsers = () => {
  return connection
    .select('*')
    .from('users')
    .then(users => {
      return users;
    })
}