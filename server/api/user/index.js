'use strict';


var router = require('express').Router(),
	controller = require('./userCtrl'),
     passport = require('passport'),
	auth = require('../../services/auth');


router.post('/register', passport.authenticate('local-register'), controller.newUser);

module.exports = router;