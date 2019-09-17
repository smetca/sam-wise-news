const connection = require('../connection');

exports.selectUser = (username) => {
  return connection
    .select('*')
    .from('users')
    .where({username})
    .then(([user]) => {
      if(!user) {
        return Promise.reject({status: 404, msg: 'Not Found'})
      }
      return user;
    });
}