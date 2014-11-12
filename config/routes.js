'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');

module.exports = function (app) {

	app.use(express.static(path.join(__dirname, '..', 'public')));
	app.use(express.static(path.join(__dirname, '..', '.tmp')));

	app.use(bodyParser.json());
	app.use(methodOverride());

	app.use('/app/jobs', require('../app/jobs'));
	app.use('/app/applies', require('../app/applies'));

	/*app.get('/', function (req, res) {
		res.send('Hello World');
	});

	app.get('/:name', function (req, res) {
		res.send('Hello ' + req.param("name"));
	});

	app.post('/json', function (req, res) {
		req.body.response = 'OK';
		res.send(req.body);
	});*/
	app.get('*', function (req, res) {
		res.sendFile(path.resolve(__dirname, '../public/index.html'));
	});
}