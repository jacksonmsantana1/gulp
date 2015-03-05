'use strict';

angular.module('project-gulp')
	.config(function ($stateProvider) {
		$stateProvider
			.state('logout', {
				url: '/logout',
				controller: 'LogoutCtrl'
			});
	})