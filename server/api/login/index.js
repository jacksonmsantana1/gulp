'use strict';

var router = require('express').Router();
var Login = require('./loginCtrl');
var passport = require('passport');
var User = require('../user/userModel')

require('../../services/passport').setup(User);

router.post('/', passport.authenticate('local-login'), Login.login);

module.exports = router;