/**
 * Environment Definitions
 * In this file, the constants are defined for the app,
 * based in the environment defined
 */

'use strict';

var _ = require('lodash');

var all = {

    env: process.env.NODE_ENV,
    port: process.env.PORT || 7203,
    db: {
        baseUrl: 'mongodb://localhost/'
    },
    secrets: {
        session: 'nathan-gay'
    },
    userRoles: ['user', 'admin'],
    secret: 'NathanBoiola',
    timeTokenExpired: 60
};

module.exports = _.merge(all, require('./' + process.env.NODE_ENV + '.js') || {});

