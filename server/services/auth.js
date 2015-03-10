'use strict';

//var jwt = require('./jwt');
var jwt = require('jsonwebtoken');
var config = require('../config/environment');
var compose = require('composable-middleware');

function isAutheticated(req, res, next) {
	console.log(req);
	return function (req, res, next) {
		console.log(req);

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

function hasRole(roleRequired) {
	console.log(roleRequired);
	if (!roleRequired) {
        return res.status(401).send({ok: false, msn: "This role: " +roleRequired+ " not exist"});
    }

    return compose()
        .use(isAutheticated())
        .use(function meetsRequirements(req, res, next, payload) {
            if (config.userRoles.indexOf(payload.sub.role) >= config.userRoles.indexOf(roleRequired)) {
                next();
            }
            else {
                res.status(403).send({ok: false, isAdmin: false});
            }
        });
}

exports.isAutheticated = isAutheticated;
exports.createSendToken = createSendToken;
exports.hasRole = hasRole;