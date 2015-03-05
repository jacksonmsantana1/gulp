'use strict';

var User = require('./userModel');
var config = require('../../config/environment');
var Auth = require('../../services/auth');


module.exports = {
	newUser: function (req, res) {
        Auth.createSendToken(req.user, res);
	}
};