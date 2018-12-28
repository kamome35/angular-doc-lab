'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var docCtrlStub = {
  index: 'docCtrl.index',
  show: 'docCtrl.show',
  create: 'docCtrl.create',
  upsert: 'docCtrl.upsert',
  patch: 'docCtrl.patch',
  destroy: 'docCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var docIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './doc.controller': docCtrlStub
});

describe('Doc API Router:', function() {
  it('should return an express router instance', function() {
    expect(docIndex).to.equal(routerStub);
  });

  describe('GET /api/doc', function() {
    it('should route to doc.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'docCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/doc/:id', function() {
    it('should route to doc.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'docCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/doc', function() {
    it('should route to doc.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'docCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/doc/:id', function() {
    it('should route to doc.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'docCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/doc/:id', function() {
    it('should route to doc.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'docCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/doc/:id', function() {
    it('should route to doc.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'docCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
