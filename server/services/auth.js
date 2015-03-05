'use strict';

//var jwt = require('./jwt');
var jwt = require('jsonwebtoken');
var config = require('../config/environment');

function isAutheticated(req, res, next) {
	return function (req, res, next) {

		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, config.secret, function (err, payload) {
			if (err.name === 'TokenExpiredError') {
				return res.status(401).send({ok: false, msn: "Session timeout: Token expired!"});
			} else if (err.name === 'JsonWebTokenError') {
				return res.status(401).send({ok: false, msn: err.message});
			} else {
				console.log('Payload: '  + payload);
				next(payload);
			}
		});
	}
}

function createSendToken(user, res) {
	var payload = {
			sub: {
				id: user.id,
				role: user.role
			}
	};

	var token = jwt.sign(payload, config.secret, {expiresInMinutes: config.timeTokenExpired});

	res.status(200).send({
		user: user.toJSON(),
		token: token
	});
}

exports.isAutheticated = isAutheticated;
exports.createSendToken = createSendToken;