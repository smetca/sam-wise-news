const app = require('../app');
const request = require('supertest');

describe('/api', () => {
  describe('/topics', () => {
    describe('GET: 200', () => {
      it('should respond with a json with a key of topics that is an array of topics', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({body}) => {
            expect(body.topics).toBeInstanceOf(Array);
          })
      });
      it('should respond with an array of topics that contain all topic properties', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({body}) => {
            console.log(body.topics[0])
            expect(Object.keys(body.topics[0])).toEqual(['slug', 'description'])
          })
      });
    });
  });
});