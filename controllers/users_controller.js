var User = require('../models/user.js'),
	mongoose = require('mongoose');

var UsersController = {};

UsersController.index = function (req, res) {
	console.log('index action called');
	res.send(200);
}

UsersController.show = function (req, res) {
	console.log('show action called');

	res.send(200);
}

UsersController.create = function (req, res) {
	console.log('create action called');
	res.send(200);
}

UsersController.update = function (req, res) {
	console.log('update action called');
	res.send(200);
}

module.exports = UsersController;