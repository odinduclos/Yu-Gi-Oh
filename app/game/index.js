'use strict';

var express = require('express');
var http = require('http').Server(express); // load http for socket io
var io = require('socket.io')(http); // load socket io for multi player game

var controller = require('./game.controller');

var router = express.Router();
router.get('/', controller.start);

module.exports = router;
console.log("index game");