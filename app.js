'use strict';

var express = require('express');
var app = module.exports = express();
var routes = require('./config/routes')(app);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var compression = require('compression');
app.use(compression());

app.set('port', process.env.PORT || 3000);

io.sockets.on('connection', require('./config/socket'));

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});