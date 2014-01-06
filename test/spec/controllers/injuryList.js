'use strict';

describe('Controller: InjurylistCtrl', function () {

  // load the controller's module
  beforeEach(module('sidelinedApp'));

  var InjurylistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InjurylistCtrl = $controller('InjurylistCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
