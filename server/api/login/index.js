'use strict';

var router = require('express').Router();
var Login = require('./loginCtrl');
var passport = require('passport');
var User = require('../user/userModel');
var Auth = require('../../services/auth');

require('../../services/passport').setup(User);

router.post('/', passport.authenticate('local-login'), Login.login);

router.get('/', Auth.hasRole('Admin'), Login.isAdmin);

module.exports = router;