'use strict';

var express = require('express');
var multipart = require('connect-multiparty');
var controller = require('./upload.controller');

var router = express.Router();

router.post('/', multipart({ uploadDir: './uploads'}), controller.create);

module.exports = router;
