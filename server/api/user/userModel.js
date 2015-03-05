'use strict';

var config = require('../../config/environment');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var UserSchema = new mongoose.Schema({
	email: String,
	password: String,
	role: String
});


UserSchema.methods.toJSON = function () {
	var user = this.toObject();
	delete user.password;

	return user;
};

UserSchema.methods.comparePasswords = function (password, callback) {
	bcrypt.compare(password, this.password, callback);
};

var User = mongoose.model('User', UserSchema);

UserSchema.pre('save', function (next) {
	var user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		}); 
	});
});

module.exports = User;