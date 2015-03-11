'use strict';

var Login = require('./loginCtrl');
var passport = require('passport');
var User = require('../user/userModel');
var Auth = require('../../services/auth');
require('../../services/passport').setup(User);

var router = require('express').Router();

router.post('/', passport.authenticate('local-login'), Login.login);

router.post('/admin', Auth.hasRole('Admin'), Login.isAdmin);

module.exports = router;