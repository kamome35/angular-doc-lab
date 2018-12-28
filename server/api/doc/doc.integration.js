'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newDoc;

describe('Doc API:', function() {
  describe('GET /api/docs', function() {
    var docs;

    beforeEach(function(done) {
      request(app)
        .get('/api/docs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          docs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(docs).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/docs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/docs')
        .send({
          name: 'New Doc',
          dir: 'This is the brand new doc!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newDoc = res.body;
          done();
        });
    });

    it('should respond with the newly created doc', function() {
      expect(newDoc.name).to.equal('New Doc');
      expect(newDoc.dir).to.equal('This is the brand new doc!!!');
    });
  });

  describe('PUT /api/docs/:id', function() {
    var updatedDoc;

    beforeEach(function(done) {
      request(app)
        .put(`/api/docs/${newDoc.id}`)
        .send({
          name: 'Updated Doc',
          dir: 'This is the updated doc!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedDoc = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDoc = {};
    });

    it('should respond with the updated doc', function() {
      expect(updatedDoc.name).to.equal('Updated Doc');
      expect(updatedDoc.dir).to.equal('This is the updated doc!!!');
    });

    it('should respond with the updated doc on a subsequent GET', function(done) {
      request(app)
        .get(`/api/docs/${newDoc.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let doc = res.body;

          expect(doc.name).to.equal('Updated Doc');
          expect(doc.dir).to.equal('This is the updated doc!!!');

          done();
        });
    });
  });

  describe('DELETE /api/docs/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/docs/${newDoc.id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when doc does not exist', function(done) {
      request(app)
        .delete(`/api/docs/${newDoc.id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
