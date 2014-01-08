'use strict';

xdescribe('Controller: SignupmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('sidelinedApp'));

  var SignupmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SignupmodalCtrl = $controller('SignupmodalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
