'use strict';

var express = require('express');
var controller = require('./doc.controller');

var router = express.Router();

router.get('/:path(*)', controller.show);

module.exports = router;
