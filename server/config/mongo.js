'use strict';

var sequence = require('sequence').Sequence.create();
var mongoose = require('mongoose');
var  moment = require('moment');
var config = require('./environment');

module.exports = function() {

	var MONGODB_URI = config.db.baseUrl + config.db.projectName,

    connectToMongoose = function (next, errorCallback) {
        mongoose.connect(MONGODB_URI, {}, function (err) {
            if (err) {
                errorCallback();
            } else {
                console.log(moment().toISOString(), '-', 'Connected to mongoDB.');
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
    });
}