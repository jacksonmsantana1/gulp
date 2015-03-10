/**
 * Created by jackson on 05/03/15.
 */
'use strict';

angular.module('project-gulp')
    .controller('AdminCtrl', function ($scope, Auth) {
        $scope.admin = Auth.isAdmin().then(function (res) {
            return true;
        }, function (err) {
            return false;
        });
    });