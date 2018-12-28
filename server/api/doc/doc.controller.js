/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/doc              ->  index
 * POST    /api/doc              ->  create
 * GET     /api/doc/:id          ->  show
 * PUT     /api/doc/:id          ->  upsert
 * PATCH   /api/doc/:id          ->  patch
 * DELETE  /api/doc/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {Doc} from '../../sqldb';
const svn = require('node-svn-ultimate').commands;

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
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
    res.status(statusCode).send(err);
  };
}

// Gets a single Doc from the DB
export function show(req, res) {
  svn.info(req.params.path, {cwd: './doc'}, function(err, data) {
    if(err) return res.status(404).end();
    svn.list(data.entry.url, function(err, data) {
      if(err) return res.status(404).end();
      if (data.list.entry !== undefined)
        return res.json([].concat(data.list.entry));
      else
        return res.json([]);
    });
  });
}

