'use strict';

var express = require('express');
var controller = require('./apply.controller');

var router = express.Router();

router.get('/', controller.list);
router.get('/:applyId', controller.show);
router.post('/', controller.create);
router.delete('/:applyId', controller.destroy);

module.exports = router;