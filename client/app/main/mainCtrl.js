'use strict';

angular.module('project-gulp')
	.controller('MainCtrl', function ($scope, $rootScope) {
        $rootScope.$broadcast('refreshMainPage', {});
	});


