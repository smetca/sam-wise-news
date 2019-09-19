const topicsRouter = require('express').Router();
const {getAllTopics} = require('../controllers/topics-controllers')
const {methodError} = require('../controllers/api-controllers')

topicsRouter.route('/')
  .get(getAllTopics)
  .all(methodError);

module.exports = topicsRouter;