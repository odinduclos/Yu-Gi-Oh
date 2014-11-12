'use strict';

var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
	title: {type: String, required: true},
	description: String,
	publisher: {type: String, required: true},
	created: {type: Date, default: Date.now},
	location: String,
	duration: String,
	price: String,
	start: String
});

module.exports = mongoose.model('Job', jobSchema);