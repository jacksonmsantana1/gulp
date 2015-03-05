'use strict';

module.exports = function (app) {
	app.use('/api/user', require('./api/user'));
    app.use('/api/login', require('./api/login'));
	//app.use('/auth', require('./auth'));
};