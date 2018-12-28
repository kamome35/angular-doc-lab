/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/docs              ->  index
 * POST    /api/docs              ->  create
 * GET     /api/docs/:id          ->  show
 * PUT     /api/docs/:id          ->  upsert
 * PATCH   /api/docs/:id          ->  patch
 * DELETE  /api/docs/:id          ->  destroy
 */

'use strict';

const jsonpatch = require('fast-json-patch');
const {Doc, User} = require('../../sqldb');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json([].concat(entity));
    }
    return null;
  };
}

function respondImage(res) {
  return function(entity) {
    if(entity) {
      res.setContentType("application/force-download");
      return res.end(new Buffer(entity.data));
    }
    return null;
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

// Gets a single Doc from the DB
export function download(req, res) {
  return Doc.findOne({
    where: {
      kind: 'file',
      parent: '/' + (req.params.parent || ''),
      name: '/' + req.params.name,
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondImage(res))
    .catch(handleError(res));
}

export function show(req, res) {
  return Doc.findAll({
    where: {
      parent: '/' + (req.params.parent || '')
    },
    include: [{
      model: User,
      attributes: ['id','name']
    }]
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Doc in the DB
export function create(req, res) {
  return Doc.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Doc in the DB at the specified ID
export function upsert(req, res) {
  if(req.body.id) {
    Reflect.deleteProperty(req.body, 'id');
  }

  return Doc.upsert(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Doc from the DB
export function destroy(req, res) {
  return Doc.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
