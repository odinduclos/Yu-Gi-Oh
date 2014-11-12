'use strict';

var mongoose = require('mongoose');
var Job = require('../jobs/job.model');

var applySchema = new mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, required: true},
	message: String,
	created: {type: Date, default: Date.now},
	job:[
      {type: mongoose.Schema.Types.ObjectId, ref: 'Job'}
    ]
});

applySchema.path('job').validate(function (val, respond) {
	Job.findById(val, function(err, job){
		if (err || !job) return respond(false);
		respond(true);
	});
}, 'This job does not exist');

module.exports = mongoose.model('Apply', applySchema);