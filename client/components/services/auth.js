'use strict';

angular.module('project-gulp')
	.factory('Auth', function ($http, API_URL, AuthToken, $state) {

		function authSuccessful(res) {
			AuthToken.setToken(res.token);
			$state.go('main');
		}

		function adminSuccessful(res) {
			AuthToken.setToken(res.token);
			$state.go('admin');
		}

		return {
			login: function (email, password) {
				return $http.post(API_URL + '/api/login', {
					email: email,
					password: password
				}).success(authSuccessful);
			},

			register: function (email, password) {
				return $http.post(API_URL + '/api/user/register', {
					email: email,
					password: password
				}).success(authSuccessful);
			},

            isAdmin: function () {
                return $http.post(API_URL + '/api/login/admin')
                    .success(adminSuccessful);
            }
		}
	});