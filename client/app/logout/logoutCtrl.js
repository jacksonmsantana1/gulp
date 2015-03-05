'use strict';

angular.module('project-gulp')
	.controller('LogoutCtrl', function (AuthToken, $state) {
		AuthToken.removeToken();
		$state.go('main');
	});