'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');

module.exports = function (app) {

	app.use(express.static(path.join(__dirname, '..', 'public')));

	app.use(bodyParser.json());
	app.use(methodOverride());

/*	app.use('/app/game', require('../app/game'));*/
	
	app.get('*', function (req, res) {
		res.sendFile(path.resolve(__dirname, '../public/index.html'));
	});
}