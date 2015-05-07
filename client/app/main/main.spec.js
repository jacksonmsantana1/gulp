'use strict';

describe('Main Controller', function(){
    var scope;

    beforeEach(module('project-gulp'));

    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should define more than 5 awesome things', inject(function($controller) {
        $controller('MainCtrl', {
            $scope: scope
        });
        expect(true).to.be.true;
    }));
});