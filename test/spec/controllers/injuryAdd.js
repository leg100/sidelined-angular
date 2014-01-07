'use strict';

describe('Controller: InjuryaddCtrl', function () {

  // load the controller's module
  beforeEach(module('sidelinedApp'));

  var InjuryaddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InjuryaddCtrl = $controller('InjuryaddCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});