'use strict';

angular.module('project-gulp')
	.controller('NavBarCtrl', function ($scope, AuthToken) {

        $scope.$on('refreshMainPage', function() {
            $scope.isAutheticated = AuthToken.isAuthenticated();
            $scope.isAdmin = AuthToken.isAdmin();
        });
	});