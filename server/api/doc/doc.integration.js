'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newDoc;

describe('Doc API:', function() {
  describe('GET /api/doc', function() {
    var docs;

    beforeEach(function(done) {
      request(app)
        .get('/api/doc')
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

  describe('POST /api/doc', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/doc')
        .send({
          name: 'New Doc',
          info: 'This is the brand new doc!!!'
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
      expect(newDoc.info).to.equal('This is the brand new doc!!!');
    });
  });

  describe('GET /api/doc/:id', function() {
    var doc;

    beforeEach(function(done) {
      request(app)
        .get(`/api/doc/${newDoc._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          doc = res.body;
          done();
        });
    });

    afterEach(function() {
      doc = {};
    });

    it('should respond with the requested doc', function() {
      expect(doc.name).to.equal('New Doc');
      expect(doc.info).to.equal('This is the brand new doc!!!');
    });
  });

  describe('PUT /api/doc/:id', function() {
    var updatedDoc;

    beforeEach(function(done) {
      request(app)
        .put(`/api/doc/${newDoc._id}`)
        .send({
          name: 'Updated Doc',
          info: 'This is the updated doc!!!'
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
      expect(updatedDoc.info).to.equal('This is the updated doc!!!');
    });

    it('should respond with the updated doc on a subsequent GET', function(done) {
      request(app)
        .get(`/api/doc/${newDoc._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let doc = res.body;

          expect(doc.name).to.equal('Updated Doc');
          expect(doc.info).to.equal('This is the updated doc!!!');

          done();
        });
    });
  });

  describe('PATCH /api/doc/:id', function() {
    var patchedDoc;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/doc/${newDoc._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Doc' },
          { op: 'replace', path: '/info', value: 'This is the patched doc!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedDoc = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedDoc = {};
    });

    it('should respond with the patched doc', function() {
      expect(patchedDoc.name).to.equal('Patched Doc');
      expect(patchedDoc.info).to.equal('This is the patched doc!!!');
    });
  });

  describe('DELETE /api/doc/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/doc/${newDoc._id}`)
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
        .delete(`/api/doc/${newDoc._id}`)
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
