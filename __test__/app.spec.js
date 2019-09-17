const app = require('../app');
const request = require('supertest');
const connection = require('../connection');

describe('/api', () => {
  afterAll(() => {
    connection.destroy();
  })
  describe('/topics', () => {
    describe('GET: 200', () => {
      it('should respond with a json with a key of topics that is an array of topics', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({body}) => {
            expect(body.topics).toBeInstanceOf(Array);
          });
      });
      it('should respond with an array of topics that contain all topic properties', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({body}) => {
            expect(Object.keys(body.topics[0])).toEqual(expect.arrayContaining(['slug', 'description']))
          });
      });
    });
  });
  describe('/users', () => {
    describe('/:username', () => {
      describe('GET: 200', () => {
        it('should respond with a single user object with valid properties when given a valid username', () => {
          return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({body}) => {
              expect(body.user).toBeInstanceOf(Object);
              expect(Object.keys(body.user)).toEqual(expect.arrayContaining(['username', 'avatar_url', 'name']))
            });
        });
      });
      describe('GET: 404', () => {
        it('should respond with a 404 when given an invalid username, as well as an error message', () => {
          return request(app)
            .get('/api/users/lurkerssssssss')
            .expect(404)
            .then(({body}) => {
              console.log(body);
              expect(body).toBeInstanceOf(Object);
              expect(body.msg).toBe('Not Found')
            });
        });
      });
    });
  });
});