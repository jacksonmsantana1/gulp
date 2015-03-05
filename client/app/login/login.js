angular.module('project-gulp')
	.config(function ($stateProvider) {
		$stateProvider.state('login', {
			url: '/login',
			templateUrl: '/client/app/login/login.html',
			controller: 'LoginCtrl'
		});
});