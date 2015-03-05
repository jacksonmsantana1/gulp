'use strict';

angular.module('project-gulp')
	.factory('AuthToken', function ($window) {
		var storage = $window.localStorage;
		var cachedToken;

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getToken() {
            if (!cachedToken) {
                cachedToken = storage.getItem('token');
            }

            return cachedToken;
        }

        function getUser() {
            var token = getToken();
            var user = {};
            if (token) {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        return {
			setToken: function (token) {
				cachedToken = token;
				storage.setItem('token', token);
			},
			isAuthenticated: function () {
				return !!this.getToken();
			},
			removeToken: function () {
				cachedToken = null;
				storage.removeItem('token');
			},
            isAdmin: function () {
                var user = getUser();
                if (Object.keys(user).length !== 0) {
                    return getUser().sub.role === 'Admin';
                }
                return false;
            },
            getToken:getToken
		}
	});

