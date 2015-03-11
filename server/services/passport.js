'use strict';

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('../api/user/userModel');

exports.setup = function (User) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

	var localStrategy = new LocalStrategy({
		    usernameField: 'email'
	    }, function (email, password, done) {

	    var searchUser = {
		    email: email
	    };

	    User.findOne(searchUser, function (err, user) {
		    	if (err) return done(err);

			    if (!user) {
				    return done(null, false, {message: 'Wrong email/password'});
			    }

			    user.comparePasswords(password, function (err, isMatch) {
				    if (err) return done(err);

				    if (!isMatch) {
					    return done(null, false, new Error('Wrong email/password'));
				    }

				    return done(null, user)
			    });
        });
	});

    var registerStrategy = new LocalStrategy({usernameField: 'email'}, function (email, password, done) {
        var searchUser = {
            email: email
        };

        User.findOne(searchUser, function (err, user) {
            if (err) return done(err);

            if (user) {
                return done(null, false, {message: 'email already exists'});

            }

            var newUser = new User({
                email: email,
                password: password,
                role: 'Admin'
            });

            newUser.save(function (err) {
                if (err) {
                    return done(null, false, {message:'Mongo Server Error'});
                } else {
                    done(null, newUser);
                }
            });
        });
    });

	passport.use('local-login' ,localStrategy);
    passport.use('local-register' ,registerStrategy);
};

