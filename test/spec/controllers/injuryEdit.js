'use strict';

describe('Controller: InjuryeditCtrl', function () {

  // load the controller's module
  beforeEach(module('sidelinedApp'));

  var InjuryeditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InjuryeditCtrl = $controller('InjuryeditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
