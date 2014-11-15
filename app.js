'use strict';
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var http = require('http').Server(express); // load http for socket io
var io = require('socket.io')(http); // load socket io for multi player game

mongoose.connect('mongodb://epitech:epitech@ds033390.mongolab.com:33390/sandbox');
mongoose.connection.once('open', function () {
	console.log('BDD OK');
});

require('./config/routes')(app);

/*var http = require('http').Server(express); // load http for socket io
var io = require('socket.io')(http); // load socket io for multi player game
io.on('connection', function(socket){
	console.log('a user connected');
});*/
console.log("app");

app.listen(process.env.PORT || 3000);