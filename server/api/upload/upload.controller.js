/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/uploads              ->  index
 * POST    /api/uploads              ->  create
 * GET     /api/uploads/:id          ->  show
 * PUT     /api/uploads/:id          ->  upsert
 * PATCH   /api/uploads/:id          ->  patch
 * DELETE  /api/uploads/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {Upload} from '../../sqldb';
const svnSpawn = require('svn-spawn');
const svn = new svnSpawn();
const fs = require('fs');
const path = require('path');

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


function creeateDir(req, res) {
  var mkdirPath = path.join('./doc', req.body.path, req.body.name);
  fs.mkdir(mkdirPath, function (err) {
    console.log(mkdirPath);
    //if (err) return res.status(500).json();
    svn.add(mkdirPath, function(err, data) {
      svn.commit(['comment dummy', mkdirPath], function(err, data) {
        if (err) throw err;
        return res.status(200).json(data);
      });
    });
  });
}

function commitFile(req, res) {
  var file = req.files.file;
  var oldPath = file.path;
  var newPath = path.join('./', req.body.path, file.name);
  console.log(req.body.path);

  fs.rename(oldPath, newPath, function (err) {
    if (err) throw err;
    svn.add(newPath, function(err, data) {
      svn.commit(['comment dummy', newPath], function(err, data) {
        if (err) throw err;
        return res.status(200).json(data);
      });
    });
  });
}

export function create(req, res) {
  switch (req.body.type) {
    case "mkdir":
      creeateDir(req, res);
      break;
    case "file":
      commitFile(req, res);
      break;
    default:
      return res.status(500).json();
  }
}
