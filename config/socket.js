var express = require('express');
var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = [];
module.exports = function (socket) {
	var other = false;
	var user = {
		id: socket.id,
		room: false,
		connected: true,
	}
	for (var i = 0; i < users.length; i++) {
		if (!users[i].room && users[i].connected) {
			other = users[i];
			break;
		}
	}
	users.push(user);
	if (other) {
		user.room = other.id;
		other.room = user.id;
		socket.emit('startGame', {error: 0, your_turn: false});
		socket.to(user.room).emit('startGame', {error: 0, your_turn: true});
	} else {
		other = user;
	}
	socket.on('draw', function (data) {
		if (data.error == 0)
			socket.to(user.room).emit('draw', data);
	});
	socket.on('play', function (data) {
		console.log(data);
		if (data.error == 0)
			socket.to(user.room).emit('play', data);
	});
	socket.on('end_turn', function (data) {
		if (data.error == 0)
			socket.to(user.room).emit('end_turn', data);
	});
	socket.on('disconnect', function () {
		socket.to(user.room).emit('endGame', {error: 31, message: 'Your opponent has left'});
		user.connected = false;
		user.room = false;
		other.room = false;
	});
}