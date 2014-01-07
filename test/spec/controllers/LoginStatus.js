'use strict';

xdescribe('Controller: LoginstatusCtrl', function () {

  // load the controller's module
  beforeEach(module('sidelinedApp'));

  var LoginstatusCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginstatusCtrl = $controller('LoginstatusCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
