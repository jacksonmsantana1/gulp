'use strict';

angular.module('project-gulp')
	.controller('RegisterCtrl', function ($scope, $rootScope, Alert, Auth) {
		$scope.submit = function () {
			Auth.register($scope.email, $scope.password)
				.success(function (res) {
					alert('success', 'OK!', 'You are now registered');
				})
				.error(function (err) {
					alert('warning', 'Opps!', 'Could not register');
				});
		};

        $scope.checkPws = function () {
            if ($scope.password !== $scope.password_confirm) {
                if ($scope.password.length === 0 || $scope.password_confirm.length === 0) {
                    $scope.alert = false;
                } else {
                    $scope.alert = true;
                }
            } else {
                $scope.alert = false;
            }
        }
	});