'use strict';

var Apply = require('./apply.model');

exports.list = function (req, res) {
	Apply
	.find()
	.limit(20)
	.sort({created: 'desc'})
	.exec(function (err, applies) {
		if (err) {
			res.sendStatus(500);
		} else {
			res.json(applies);
		}
	});
}

exports.show = function (req, res) {
	var applyId = req.param('applyId');
	Apply
	.findById(applyId)
	.exec(function (err, apply) {
		if (err) {
			res.status(500).json(err);
		} else {
			res.json(apply);
		}
	});
}

exports.create = function (req, res) {
	var apply = new Apply(req.body);
	apply.save(function (err) {
		if (err) {
			res.json(500, err);
		} else if (!apply) {
			res.json(500, apply);
		}
		res.status(200).json(apply);
	});
}

exports.destroy = function (req, res) {
	var applyId = req.param('applyId');
	Apply.findByIdAndRemove(applyId).exec(function(err) {
		if (err) {
			res.status(400).json(err);
		} else {
			res.sendStatus(200);
		}
	});
}