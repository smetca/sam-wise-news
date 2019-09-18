const app = require('../app');
const request = require('supertest');
const connection = require('../connection');
const chai = require('chai');
const chaiExpect = chai.expect;
const chaiSorted = require('sams-chai-sorted');
chai.use(chaiSorted);

describe('/api', () => {
  beforeEach(() => {
    return connection.seed.run();
  })
  afterAll(() => {
    return connection.destroy();
  })

  describe('/topics', () => {
    describe('GET: 200s', () => {
      it('should respond with 200 and an array of topics that contain all topic properties', () => {
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
      describe('GET: 200s', () => {
        it('should respond with 200 and a single user object with valid properties when given a valid username', () => {
          return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({body}) => {
              expect(Object.keys(body.user)).toEqual(expect.arrayContaining(['username', 'avatar_url', 'name']))
            });
        });
      });
      describe('GET: 400s', () => {
        it('should respond with a 404 when given an non existant username, as well as an error message', () => {
          return request(app)
            .get('/api/users/lurkerssssssss')
            .expect(404)
            .then(({body}) => {
              expect(body.msg).toBe('Not Found')
            });
        });
      });
    });

  });

  describe('/articles', () => {
    describe('GET: 200s', () => {
      it('should respond with 200 and an array of articles', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({body}) => {
            expect(Object.keys(body.articles[0])).toEqual(expect.arrayContaining([
              'author',
              'title',
              'article_id',
              'topic',
              'created_at',
              'votes',
              'comment_count'
            ]))
          })
      });
      it('should respond with 200 and articles should be sorted by created_at by default', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({body}) => {
            chaiExpect(body.articles).to.be.descendingBy('created_at')
          })
      });
      it('should respond with 200 and allow sorting by any valid column', () => {
        return request(app)
          .get('/api/articles?sortBy=title')
          .expect(200)
          .then(({body}) => {
            chaiExpect(body.articles).to.be.descendingBy('title');
          });
      });
      it('should respond with 200 and be sorted by descending by default', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({body}) => {
            chaiExpect(body.articles).to.be.descendingBy('created_at')
          })
      });
      it('should respond with 200 and allow sorting to be done asc', () => {
        return request(app)
          .get('/api/articles?orderBy=asc')
          .expect(200)
          .then(({body}) => {
            chaiExpect(body.articles).to.be.sortedBy('created_at');
          });
      });
      it('should respond with 200 and allow filtering by author name', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge')
          .expect(200)
          .then(({body}) => {
            expect(body.articles.every(article => article.author === 'butter_bridge')).toBe(true);
          })
      });
      it('should respond with 200 and allow for filtering by topic name', () => {
        return request(app)
          .get('/api/articles?topic=mitch')
          .expect(200)
          .then(({body}) => {
            expect(body.articles.every(article => article.topic === 'mitch')).toBe(true);
          })
      });
      it('should respond with 200 and all queries should be usable simultaneously', () => {
        return request(app)
          .get('/api/articles?sortBy=title&orderBy=desc&author=butter_bridge&topic=mitch')
          .expect(200)
          .then(({body}) => {
            expect(
              body.articles.every(article => {
              return article.author === 'butter_bridge' && article.topic === 'mitch'
              }))
              .toBe(true);
            chaiExpect(body.articles).to.be.descendingBy('title');
          })
      });
    });
    describe('GET: 400s', () => {
      it('should respond with 400 and an error message when given an invalid query', () => {
        return request(app)
          .get('/api/articles?sortBy=1010')
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe('select \"articles\".*, count(\"comment_id\") as \"comment_count\" from \"articles\" left join \"comments\" on \"articles\".\"article_id\" = \"comments\".\"article_id\" group by \"articles\".\"article_id\" order by \"1010\" desc - column \"1010\" does not exist');
          })
      });
    });

    describe('/:article_id', () => {
      describe('GET: 200s', () => {
        it('should respond with 200 and an article with all article properties when given a valid article_id', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body}) => {
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
              expect(body.msg).toBe('Not Found');
            })
        });
        it('should respond with a 400 given an invalid article id, and an error message', () => {
          return request(app)
            .get('/api/articles/not-a-valid-id')
            .expect(400)
            .then(({body}) => {
              expect(body.msg).toBe('select "articles".*, count("comment_id") as "comment_count" from "articles" left join "comments" on "articles"."article_id" = "comments"."article_id" where "articles"."article_id" = $1 group by "articles"."article_id" - invalid input syntax for integer: "not-a-valid-id"');
            });
        });
      });
      describe('PATCH: 200s', () => {
        it('should respond with 200 and update an existing article\'s votes and respond with the changed article', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 30 })
            .expect(200)
            .then(({body}) => {
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

      describe('/comments', () => {
        describe('GET: 200s', () => {
          it('should respond with 200 and an array of comments posted on a specific article', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({body}) => {
                expect(Object.keys(body.comments[0])).toEqual(expect.arrayContaining([
                  'comment_id',
                  'votes',
                  'created_at',
                  'author',
                  'body'
                ]))
              })
          });
          it('should respond with 200 and comments sorted by default with created_at', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({body}) => {
                chaiExpect(body.comments).to.be.sortedBy('created_at');
              })
          });
          it('should respond with 200 and comments sorted by any valid column', () => {
            return request(app)
              .get('/api/articles/1/comments?sortBy=votes')
              .expect(200)
              .then(({body}) => {
                chaiExpect(body.comments).to.be.sortedBy('votes');
              })
          });
          it('should respond with 200 and allow columns to be ordered by descending', () => {
            return request(app)
              .get('/api/articles/1/comments?orderBy=desc')
              .expect(200)
              .then(({body}) => {
                chaiExpect(body.comments).to.be.descendingBy('created_at');
              })
          });
        });
        describe('GET: 400s', () => {
          it('should respond with 404 when passed an article that doesn\'t exist', () => {
            return request(app)
              .get('/api/articles/1000/comments')
              .expect(404)
              .then(({body}) => {
                expect(body.msg).toBe('Not Found')
              })
          });
          it('should respond with 400 when passed an article that is invalid', () => {
            return request(app)
              .get('/api/articles/not-a-valid-article/comments')
              .expect(400)
              .then(({body}) => {
                expect(body.msg).toBe('select * from \"comments\" where \"article_id\" = $1 order by \"created_at\" asc - invalid input syntax for integer: \"not-a-valid-article\"')
              })
          });
          it('should respond with 400 and an error message if passed an invalid query', () => {
            return request(app)
              .get('/api/articles/1/comments?sortBy=100&orderBy=200')
              .expect(400)
              .then(({body}) => {
                expect(body.msg).toBe('select * from \"comments\" where \"article_id\" = $1 order by \"100\" asc - column \"100\" does not exist');
              })
          });
        });
        describe('POST: 200s', () => {
          it('should respond with 201 and post a new comment on a specific article and return that posted comment', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({username: 'lurker', body: 'Just testing'})
              .expect(201)
              .then(({body}) => {
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
        describe('POST: 400s', () => {
          it('should respond with 400 and an error message when passed an invalid comment object properties', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({username: 23, body: 30101})
              .expect(400)
              .then(({body}) => {
                expect(body.msg).toBe('insert into "comments" ("article_id", "author", "body", "created_at", "votes") values ($1, $2, $3, $4, $5) returning * - insert or update on table "comments" violates foreign key constraint "comments_author_foreign"');
              })
          });
          it('should respond with 400 and an error message when passed a comment from an invalid user', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({username: 'idontexist', body: 'Just testing'})
              .expect(400)
              .then(({body}) => {
                expect(body.msg).toBe('insert into "comments" ("article_id", "author", "body", "created_at", "votes") values ($1, $2, $3, $4, $5) returning * - insert or update on table "comments" violates foreign key constraint "comments_author_foreign"');
              })
          });
          it('should respond with 422 when requesting an article that doesn\'t exist an an error message', () => {
            return request(app)
              .post('/api/articles/1000/comments')
              .send({username: 'lurker', body: 'Just testing'})
              .expect(422)
              .then(({body}) => {
                expect(body.msg).toEqual('Unprocessable Entity');
              })
          });
        });
      });

    });
  });

  describe('/comments', () => {

    describe('/:comment_id', () => {
      describe('PATCH: 200s', () => {
        it('should respond with 200 the votes on a specific comment should be updated', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 100 })
            .expect(200)
            .then(({body}) => {
              expect(Object.keys(body.comment)).toEqual(expect.arrayContaining([
                'comment_id',
                'votes',
                'created_at',
                'author',
                'body'
              ]))
              expect(body.comment.votes).toBe(116);
            })
        });
      });
    });
    describe('PATCH: 400s', () => {
      it('should respond with 400 and an error message when given an invalid votes object', () => {
        return request(app)
          .patch('/api/comments/1')
          .send(({inc_votes: 'not-a-valid-vote-increment'}))
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe('update \"comments\" set \"votes\" = $1 where \"comment_id\" = $2 returning * - invalid input syntax for integer: \"16not-a-valid-vote-increment\"');
          })
      });
    });
    describe('DELETE: 204', () => {
      it('should respond with 204 with no content successfully deleting a comment given a valid id', () => {
        return request(app)
          .del('/api/comments/1')
          .expect(204)
          .then(({body}) => {
            expect(body).toEqual({});
          })
      });
    });
    describe('DELETE: 400s', () => {
      it('should respond with 404 and an error message when given a comment_id that doesn\'t exist', () => {
        return request(app)
          .del('/api/comments/1000')
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toBe('Not Found')
          }) 
      });
      it('should respond with 400 and an error message when given an invalid comment_id', () => {
        return request(app)
          .del('/api/comments/not-a-valid-id')
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe('delete from \"comments\" where \"comment_id\" = $1 returning * - invalid input syntax for integer: \"not-a-valid-id\"');
          })
      });
    });
  });

});