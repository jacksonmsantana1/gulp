'use strict';

var Auth = require('../../services/auth');

module.exports = {
	login: function (req, res) {
		Auth.createSendToken(req.user, res)
	},
    isAdmin: function (req, res) {
        Auth.createSendToken(req.user, res)
    }
};