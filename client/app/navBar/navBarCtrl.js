'use strict';

angular.module('project-gulp')
	.controller('NavBarCtrl', function ($scope, AuthToken, Auth) {

        $scope.$on('refreshMainPage', function() {
            $scope.isAutheticated = AuthToken.isAuthenticated();
            $scope.isAdmin = AuthToken.isAdmin();
        });
	});