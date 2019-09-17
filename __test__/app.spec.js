const app = require('../app');
const request = require('supertest');
const connection = require('../connection');

describe('/api', () => {
  beforeEach(() => {
    return connection.seed.run();
  })
  afterAll(() => {
    return connection.destroy();
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
        it('should respond with a 404 when given an non existant username, as well as an error message', () => {
          return request(app)
            .get('/api/users/lurkerssssssss')
            .expect(404)
            .then(({body}) => {
              expect(body).toBeInstanceOf(Object);
              expect(body.msg).toBe('Not Found')
            });
        });
      });
    });
  });
  describe('/articles', () => {
    describe('/:article_id', () => {
      describe('/comments', () => {
        describe('POST: 200', () => {
          it('should post a new comment on a specific article and return that posted comment', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({username: 'lurker', body: 'Just testing'})
              .expect(200)
              .then(({body}) => {
                expect(body.comment).toBeInstanceOf(Object);
                expect(Object.keys(body.comment)).toEqual(expect.arrayContaining([
                  'comment_id',
                  'votes',
                  'created_at',
                  'author',
                  'body'
                ]));
              })
          });
        });
      });
      describe('GET: 200', () => {
        it('should respond with an article with all article properties when given a valid article_id', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body}) => {
              expect(body.article).toBeInstanceOf(Object);
              expect(Object.keys(body.article)).toEqual(expect.arrayContaining([
                'author',
                'title',
                'article_id',
                'body',
                'topic',
                'created_at',
                'votes',
                'comment_count'
              ]))
            })
        });
      });
      describe('GET: 400s', () => {
        it('should respond with a 404 given a non existant article id, and an error message', () => {
          return request(app)
            .get('/api/articles/10000')
            .expect(404)
            .then(({body}) => {
              expect(body).toBeInstanceOf(Object);
              expect(body.msg).toBe('Not Found');
            })
        });
        it('should respond with a 400 given an invalid article id, and an error message', () => {
          return request(app)
            .get('/api/articles/not-a-valid-id')
            .expect(400)
            .then(({body}) => {
              expect(body).toBeInstanceOf(Object);
              expect(body.msg).toBe('select * from "articles" where "article_id" = $1 - invalid input syntax for integer: "not-a-valid-id"');
            });
        });
      });
      describe('PATCH: 200', () => {
        it('should update an existing article\'s votes and respond with the changed article', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 30 })
            .expect(200)
            .then(({body}) => {
              expect(body.article).toBeInstanceOf(Object)
              expect(Object.keys(body.article)).toEqual(expect.arrayContaining([
                'author',
                'title',
                'article_id',
                'body',
                'topic',
                'created_at',
                'votes'
              ]));
            })
        });
      });
    });
  });
});