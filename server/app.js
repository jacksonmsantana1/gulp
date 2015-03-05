'use strict';

var express = require('express');
var app = express();
var config = require('./config/environment');
var environment = config.env;
var sequence = require('sequence').Sequence.create();
var mongoose = require('mongoose');
var  moment = require('moment');

require('./config/express')(app);
require('./routes')(app);

console.log('** Starting Node Server. **');
console.log('PORT=' + config.port);
console.log('NODE_ENV=' + config.env);

var MONGODB_URI = config.db.baseUrl + config.db.projectName,

    /**
     * Function connectToMongoose
     * The actual connection function. When the connection succeeds, it calls the next callback,
     * that will make the sequence advance. When it fails, it trigers the errorCallback function,
     * that works recursively with guaranteeMongooseConnection function, to ensure a connection is
     * obtained before starting the express server
     * @param next next param from the sequence
     * @param errorCallback the function errorCallback
     */
    connectToMongoose = function (next, errorCallback) {
        mongoose.connect(MONGODB_URI, {}, function (err) {
            if (err) {
                errorCallback();
            } else {
                console.log(moment().toISOString(), '-', 'Connected to mongoDB.URL: '+ MONGODB_URI);
                if (typeof next === 'function') {
                    next();
                }
            }
        });
    },

    errorCallback = function (next) {
        console.log(moment().toISOString(), '-', 'Error connecting to MongoDB. Trying again in 1000 ms');
        setTimeout(function () {
            guaranteeMongooseConnection(next);
        }, 1000);
    },


    guaranteeMongooseConnection = function (next) {
        connectToMongoose(next, function () {
            errorCallback(next);
        });
    };

sequence
    .then(function (next) {
        guaranteeMongooseConnection(next);
    })
    .then(function () {
        process.on('SIGINT', function() {
            mongoose.connection.close(function () {
                console.log('Mongoose disconnected through app termination');
                process.exit(0);
            });
        });

        app.listen(config.port, function() {
            console.log('Express server listening on port ' + config.port);
            console.log('env = ' + app.get('env') +
                    '\n__dirname = ' + __dirname +
                    '\nprocess.cwd = ' + process.cwd());
        });
    });


module.exports = app;