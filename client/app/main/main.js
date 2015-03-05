angular.module('project-gulp')
	.config(function ($stateProvider) {
		$stateProvider.state('main', {
			url: '/',
			templateUrl: '/client/app/main/main.html',
			controller: 'MainCtrl'
		});
});