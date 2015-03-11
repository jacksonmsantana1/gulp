/**
 * Created by jackson on 05/03/15.
 */
'use strict';

angular.module('project-gulp')
    .controller('AdminCtrl', function ($scope, Auth) {
        Auth.isAdmin()
            .success(function (res) {
                $scope.admin = true;
            })
            .error(function (err) {
                $scope.admin = false;
            });
    });