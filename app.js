'use strict';
var express = require('express');
var methodOverride = require('method-override');
var csurf = require('csurf');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://epitech:epitech@ds033390.mongolab.com:33390/sandbox');
mongoose.connection.once('open', function () {
	console.log('BDD OK');
});

require('./config/routes')(app);

app.listen(process.env.PORT || 3000);