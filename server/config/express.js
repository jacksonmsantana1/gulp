/**
 * Express Configuration File
 */

'use strict';

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    errorHandler = require('errorhandler'),
    bodyParser = require('body-parser'),
	compress = require('compression'),
	cors = require('cors'),
	logger = require('morgan'),
    config = require('./environment'),
    environment = config.env,
    passport = require('passport'),
    express = require('express');


module.exports = function (app) {
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(compress());
	app.use(logger('dev'));

//    app.use(function (req, res, next) {
//        res.header('Access-Control-Allow-Origin', '*');
//        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//        res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorization');
//
//        next();
//    });

	app.use(cors());
    app.use(cookieParser());

    switch (environment) {
        case 'build':
            console.log('** BUILD **');
            app.use(express.static('./build/'));
            app.use('/*', express.static('./build/index.html'));
            break;
        default:
            console.log('** DEV **');
            app.use(express.static('./client/'));
            app.use(express.static('./'));
            app.use(express.static('./tmp'));
            app.use('/*', express.static('./client/index.html'));
            break;
    }

    app.use(errorHandler());
};
