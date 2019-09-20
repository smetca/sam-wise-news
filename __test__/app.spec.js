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

  describe('GET: 200', () => {
    it('should respond with 200 and a json with all endpoints described', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
          expect(body.endpoints).toEqual(expect.objectContaining({
            'GET /api': expect.any(Object),
            'GET /api/topics': expect.any(Object),
            'GET /api/articles': expect.any(Object),
            'GET /api/articles/:article_id': expect.any(Object),
            'PATCH /api/articles/:article_id': expect.any(Object),
            'GET /api/articles/:article_id/comments': expect.any(Object),
            'POST /api/articles/:article_id/comments': expect.any(Object),
            'PATCH /api/comments/:comment_id': expect.any(Object),
            'DELETE /api/comments/:comment_id': expect.any(Object),
            'GET /api/users/:username': expect.any(Object)
          }))
        })
    });
  });

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
    describe('ALL: 400s', () => {
      it('should respond with 405 given an invalid method', () => {
        return request(app)
          .put('/api/topics')
          .expect(405);
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
        it('should respond with 404 when given an non existant username, as well as an error message', () => {
          return request(app)
            .get('/api/users/lurkerssssssss')
            .expect(404)
            .then(({body}) => {
              expect(body.msg).toBe('Not Found')
            });
        });
      });
      describe('ALL: 400s', () => {
          it('should respond with 405 when given an invalid method', () => {
            return request(app)
              .put('/api/users/lurker')
              .expect(405);
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
      it('should respond with 200 and an empty array when passed an author that doesn\'t exist', () => {
        return request(app)
          .get('/api/articles?author=lurker')
          .expect(200)
          .then(({body}) => {
            expect(body.articles).toEqual([]);
          })
      });
      it('should respond with 200 and an empty array when passed an topic that doesn\'t exist', () => {
        return request(app)
          .get('/api/articles?topic=paper')
          .expect(200)
          .then(({body}) => {
            expect(body.articles).toEqual([]);
          })
      });
      it('should respond with 200 and a limit of 4 articles by default', () => {
        return request(app)
          .get('/api/articles')
          .then(({body}) => {
            expect(body.articles.length).toBe(4);
          })
      });
      it('should respond with 200 and the correct article for the page', () => {
        return request(app)
          .get('/api/articles?p=2')
          .then(({body}) => {
            expect(body.articles[0].article_id).toBe(5);
          })
      });
      it('should respond with 200 and a user defined page limit', () => {
        return request(app)
          .get('/api/articles?limit=3')
          .then(({body}) => {
            expect(body.articles.length).toBe(3);
          })
      });
      it('should respond with 200 and the correct page, for a user defined limit and page number', () => {
        return request(app)
          .get('/api/articles?limit=2&p=3')
          .then(({body}) => {
            expect(body.articles[0].article_id).toBe(5);
            expect(body.articles.length).toBe(2);
          })
      });
      it('should respond with 200 and an empty array when given a page with no content', () => {
        return request(app)
          .get('/api/articles?p=100')
          .then(({body}) => {
            expect(body.articles).toEqual([]);
          })
      });
      it('should respond with 200 and an empty array when given a limit of 0', () => {
        return request(app)
          .get('/api/articles?limit=0')
          .then(({body}) => {
            expect(body.articles).toEqual([]);
          })
      });
    });
    describe('GET: 400s', () => {
      it('should respond with 400 and an error message when given an invalid sort', () => {
        return request(app)
          .get('/api/articles?sortBy=1010')
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe('Invalid Column Query');
          })
      });
      it('should respond with 400 and an error message when given an invalid order', () => {
        return request(app)
          .get('/api/articles?orderBy=12039')
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe('Invalid Order Query');
          })
      });
      it('should respond with 400 and an error message given an invalid limit', () => {
        return request(app)
          .get('/api/articles?limit=-1')
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe('Invalid Page Limit')
          })
      });
    });
    describe('ALL: 400s', () => {
      it('should respond with 405 given an invalid method', () => {
        return request(app)
          .put('/api/articles')
          .expect(405);
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
              expect(body.msg).toBe('Invalid Input');
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
      describe('ALL: 400s', () => {
        it('should respond with 405 given an invalid method', () => {
          return request(app)
            .put('/api/articles/1')
            .expect(405);
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
                chaiExpect(body.comments).to.be.descendingBy('created_at');
              })
          });
          it('should respond with 200 and comments sorted by any valid column', () => {
            return request(app)
              .get('/api/articles/1/comments?sortBy=votes')
              .expect(200)
              .then(({body}) => {
                chaiExpect(body.comments).to.be.descendingBy('votes');
              })
          });
          it('should respond with 200 and allow columns to be ordered by ascending', () => {
            return request(app)
              .get('/api/articles/1/comments?orderBy=asc')
              .expect(200)
              .then(({body}) => {
                chaiExpect(body.comments).to.be.sortedBy('created_at');
              })
          });
          it('should respond with 200 and an empty array of comments when an article has no comments', () => {
            return request(app)
              .get('/api/articles/2/comments')
              .expect(200)
              .then(({body}) => {
                expect(body.comments).toEqual([]);
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
                expect(body.msg).toBe('Invalid Input')
              })
          });
          it('should respond with 400 and an error message if passed an invalid query', () => {
            return request(app)
              .get('/api/articles/1/comments?sortBy=100&orderBy=200')
              .expect(400)
              .then(({body}) => {
                expect(body.msg).toBe('Invalid Column Query');
              })
          });
          it('should respond with 200 and a limit of 4 comments by default', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .then(({body}) => {
                expect(body.comments.length).toBe(4);
              })
          });
          it('should respond with 200 and the correct comment for the page', () => {
            return request(app)
              .get('/api/articles/1/comments?p=2')
              .then(({body}) => {
                expect(body.comments[0].comment_id).toBe(6);
              })
          });
          it('should respond with 200 and a user defined page limit', () => {
            return request(app)
              .get('/api/articles/1/comments?limit=3')
              .then(({body}) => {
                expect(body.comments.length).toBe(3);
              })
          });
          it('should respond with 200 and the correct page, for a user defined limit and page number', () => {
            return request(app)
              .get('/api/articles/1/comments?limit=2&p=3')
              .then(({body}) => {
                console.log(body.comments);
                expect(body.comments[0].comment_id).toBe(6);
                expect(body.comments.length).toBe(2);
              })
          });
          it('should respond with 200 and an empty array when given a page with no content', () => {
            return request(app)
              .get('/api/articles/1/comments?p=100')
              .then(({body}) => {
                expect(body.comments).toEqual([]);
              })
          });
          it('should respond with 200 and an empty array when given a limit of 0', () => {
            return request(app)
              .get('/api/articles/1/comments?limit=0')
              .then(({body}) => {
                expect(body.comments).toEqual([]);
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
                expect(body.msg).toBe('Invalid reference ID');
              })
          });
          it('should respond with 400 and an error message when passed a comment from an invalid user', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({blarg: 'idontexist', body: 'Just testing'})
              .expect(400)
              .then(({body}) => {
                expect(body.msg).toBe('Invalid Input');
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
        describe('ALL: 400s', () => {
          it('should respond with 405 given an invalid method', () => {
            return request(app)
              .put('/api/articles/1/comments')
              .expect(405);
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
      describe('PATCH: 400s', () => {
        it('should respond with 400 and an error message when given an invalid votes object', () => {
          return request(app)
            .patch('/api/comments/1')
            .send(({inc_votes: 'not-a-valid-vote-increment'}))
            .expect(400)
            .then(({body}) => {
              expect(body.msg).toBe('Invalid Input');
            })
        });
        it('should respond with 404 and an error message when given a comment id that doesn\'t exist', () => {
          return request(app)
            .patch('/api/comments/1000')
            .send({inc_votes: 100})
            .expect(404)
            .then(({body}) => {
              expect(body.msg).toBe('Not Found');
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
              expect(body.msg).toBe('Invalid Input');
            })
        });
      });
      describe('ALL: 400s', () => {
        it('should respond with 405 given an invalid method', () => {
          return request(app)
            .put('/api/comments/1')
            .expect(405);
        });
      });
    });
  });

});