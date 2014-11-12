'use strict';

var jobs = [
	{_id: "1", title: "Node.js Developer"},
	{_id: "2", title: "IOS Developer"},
	{_id: "3", title: "Android Developer"},
	{_id: "4", title: "C++ Developer"},
	{_id: "5", title: "C Developer"},
	{_id: "6", title: "C# Developer"},
	{_id: "7", title: "Java Developer"}
];

var Job = require('./job.model');

exports.list = function (req, res) {
	Job
	.find()
	.limit(20)
	.sort('')
	.exec(function (err, jobs) {
		if (err) {
			res.sendStatus(500);
		} else {
			res.json(jobs);
		}
	});
}

exports.show = function (req, res) {
	var jobId = req.param('jobId');
	Job
	.findById(jobId)
	.exec(function (err, job) {
		if (err) {
			res.json(500, err);
		} else {
			res.json(job);
		}
	});
}

exports.create = function (req, res) {
	var job = new Job(req.body);
	job.save(function (err) {
		if (err) {
			res.json(400, err);
		} else if (!job) {
			res.json(job);
		}
	});
}

exports.destroy = function (req, res) {
	var jobId = req.param('jobId');
	Job.findByIdAndRemove(jobId).exec(function(err) {
		if (err) {
			res.json(400, err);
		} else {
			res.sendStatus(200);
		}
	});
}