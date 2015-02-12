'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var morgan     = require("morgan");
var jwt        = require("jsonwebtoken");
var mongoose   = require("mongoose");
var app        = express();

var port = process.env.PORT || 3001;
var User     = require('./User');

mongoose.connect('mongodb://localhost/test');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

module.exports = function (app) {

	app.use(express.static(path.join(__dirname, '..', 'public')));

	app.use(bodyParser.json());
	app.use(methodOverride());

	app.use('/app/game', require('../app/game'));
	
	app.post('/authenticate', function(req, res) {
		User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
			if (err) {
				res.json({
					type: false,
					data: "Error occured: " + err
				});
			} else {
				if (user) {
				   res.json({
						type: true,
						data: user,
						token: user.token
					}); 
				} else {
					res.json({
						type: false,
						data: "Incorrect email/password"
					});    
				}
			}
		});
	});


	app.post('/signin', function(req, res) {
		User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
			if (err) {
				res.json({
					type: false,
					data: "Error occured: " + err
				});
			} else {
				if (user) {
					res.json({
						type: false,
						data: "User already exists!"
					});
				} else {
					var userModel = new User();
					userModel.email = req.body.email;
					userModel.password = req.body.password;
					userModel.save(function(err, user) {
						user.token = jwt.sign(user, 'secret_passphrase');
						user.save(function(err, user1) {
							res.json({
								type: true,
								data: user1,
								token: user1.token
							});
						});
					})
				}
			}
		});
	});

	app.get('/me', ensureAuthorized, function(req, res) {
		User.findOne({token: req.token}, function(err, user) {
			if (err) {
				res.json({
					type: false,
					data: "Error occured: " + err
				});
			} else {
				res.json({
					type: true,
					data: user
				});
			}
		});
	});

	function ensureAuthorized(req, res, next) {
		var bearerToken;
		var bearerHeader = req.headers["authorization"];
		if (typeof bearerHeader !== 'undefined') {
			var bearer = bearerHeader.split(" ");
			bearerToken = bearer[1];
			req.token = bearerToken;
			next();
		} else {
			res.sendStatus(403);
		}
	}

	process.on('uncaughtException', function(err) {
		console.log(err);
	});
		
	app.get('*', function (req, res) {
		res.sendFile(path.resolve(__dirname, '../public/index.html'));
	});
}