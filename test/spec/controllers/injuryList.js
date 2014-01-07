'use strict';

xdescribe('Controller: InjuryListCtrl', function () {

  angular.module('mock.Injury', [])
    .factory('Injury', function() {
      var Injury = [];
      Injury.query = function(query, response) {
        Injury.respondWith = function(injuries) {
          response(injuries);
          Injury.respondWith = undefined;
        };
      };
      return Injury;
    });

  // load the controller's module
  beforeEach(module('sidelinedApp.injuries'));
  beforeEach(module('mock.Injury'));

  var InjuryListCtrl,
    Injury,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _Injury_) {
    scope = $rootScope.$new();
    Injury = _Injury_;
    spyOn(Injury, 'query').andCallThrough();

    InjuryListCtrl = $controller('InjuryListCtrl', {
      $scope: scope,
      injuries: Injury.query(),
      action: 'add'
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
