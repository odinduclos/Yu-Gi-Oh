'use strict';

console.log("game controller");

exports.start = function (req, res) {

	console.log("init game controller");
	io.on('connection', function(socket){
	  console.log('a user connected');
	});
}