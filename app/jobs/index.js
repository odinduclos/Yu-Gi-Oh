'use strict';

var express = require('express');
var controller = require('./job.controller');

var router = express.Router();

router.get('/', controller.list);
router.get('/:jobId', controller.show);
router.post('/', controller.create);
router.delete('/:jobId', controller.destroy);

module.exports = router;