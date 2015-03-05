angular.module('project-gulp')
	.config(function ($stateProvider) {
		$stateProvider.state('register', {
			url: '/register',
			templateUrl: '/client/app/user/register/register.html',
			controller: 'RegisterCtrl'
		});
});