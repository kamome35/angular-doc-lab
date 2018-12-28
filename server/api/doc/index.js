'use strict';

var express = require('express');
var controller = require('./doc.controller');

var router = express.Router();

router.get('/download/:parent(*)/:name', controller.download);
router.get('/', controller.show);
router.get('/:parent(*)', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.delete('/:id', controller.destroy);

module.exports = router;
