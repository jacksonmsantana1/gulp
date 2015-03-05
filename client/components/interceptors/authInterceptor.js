'use strict';

angular.module('project-gulp')
	.factory('authInterceptor', function (AuthToken, $location, $q) {

		return {
			request: function (config) {
				var token = AuthToken.getToken();
				config.headers = config.headers || {};

				if (token) {
					config.headers.Authorization = 'Bearer ' + token;
				}

				return config;
			},

            responseError: function(response) {
                if(response.status === 401) {
                    $location.path('/');
                    AuthToken.removeToken();
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
		}
	});