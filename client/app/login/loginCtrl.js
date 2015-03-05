'use strict';

angular.module('project-gulp')
	.controller('LoginCtrl', function ($scope, $rootScope, Alert, Auth) {
		$scope.submit = function () {
			Auth.login($scope.email, $scope.password)
				.success(function (res) {
					alert('success', 'User loged!', 'Welcome, ' + res.user.email + '!');
				})
				.error(function (err) {
					alert('warning', 'Something went wrong :(', err.message);
				});
		}
	});