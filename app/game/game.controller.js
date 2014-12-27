'use strict';

console.log("game controller");

var express = require('express')();
var http = require('http').Server(express); // load http for socket io
var io = require('socket.io')(http); // load socket io for multi player game
/*var io = require('socket.io')(http).listen(server);*/

exports.start = function (req, res) {

	console.log("init game controller");
	io.on('connection', function(socket){
	  console.log('a user connected');
	});

	socket.on('disconnect', function(){
		for (var i = 0; i < users.length; i++) {
			if (users[i].socket.id == socket.id) {
				// console.log("splice", users[i].id);
				users.splice(i, 1);
				break;
			}
		}
		console.log('user disconnected');
	});
}