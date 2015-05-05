'use strict';


angular
	.module('project-gulp', ['ui.router'])
		.config(function ($urlRouterProvider, $httpProvider) {
        $urlRouterProvider.otherwise(
            function($injector, $location) {
                var auth = $injector.get('AuthToken');
                if (auth.isAuthenticated()) {
                    $location.path('/main');
                } else {
                    $location.path('/login');
                }
            });

			$httpProvider.interceptors.push('authInterceptor');
		})
        .run(function ($rootScope, $location, AuthToken , $state) {
            // Redirect to login if route requires auth and you're not logged in
            $rootScope.$on('$stateChangeStart', function () {
                $rootScope.$on('$stateChangeStart', function (event, next) {
                    if (next.authenticate && !AuthToken.isAuthenticated()) {
                        $state.go('login');
                    }
                });
            });

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
                $rootScope.previousState = fromState;
                $rootScope.actualState = toState;
                console.log("Vai tomarr no seu cu");
            });

            $rootScope.$on('$stateChangeError', function() {
                if (AuthToken.isAuthenticated()) {
                    $state.go('main');
                } else {
                    $state.go('login');
                }
            });
        })
		.constant('API_URL', 'http://localhost:7203');

