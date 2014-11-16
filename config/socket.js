var users = [];

module.exports = function (socket) {
	var id = socket.id;
	var room = false;
	var ennemy_socket = false;
	for (var i = 0; i < users.length; i++) {
		if (!users[i].room && !users[i].connected) {
			room = users[i].id;
			ennemy_socket = users[i].socket;
			break;
		}
	}
	/*for (var i = 0; i < users.length; i++) {
		console.log(users[i].id);
	};*/
	if (!ennemy_socket) {
		socket
		socket.emit('server_log', 'Waiting for the other player...');
	} else {
		socket.emit('server_log', 'The other player is already here!');
	}
	var user = {
		socket: socket,
		ennemy_socket: ennemy_socket,
		room: room
	};
	users.push(user);
	console.log(socket.id);
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