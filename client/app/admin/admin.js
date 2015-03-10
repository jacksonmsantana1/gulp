/**
 * Created by jackson on 05/03/15.
 */
'use strict';

angular.module('project-gulp')
    .config(function ($stateProvider) {
        $stateProvider.state('admin', {
            url: '/admin',
            templateUrl: '/client/app/admin/admin.html',
            controller: 'AdminCtrl'
        });
    });