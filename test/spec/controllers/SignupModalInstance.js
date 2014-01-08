'use strict';

describe('Controller: SignupModalInstanceCtrl', function () {
  angular.module('mock.Session', [])
    .factory('Session', function($q) {
      var Session = {};
      Session.deferred = $q.defer();
      Session.signup = function() {
        return this.deferred.promise; 
      };
      Session.requestCurrentUser =  function() {
        return null;
      };
      return Session;
    });

 
  // load the controller's module
  beforeEach(module('sidelinedApp'));
  beforeEach(module('mock.Session'));
  beforeEach(module('ui.bootstrap.modal'));

  var SignupModalInstanceCtrl,
    scope,
    Session,
    $modal,
    $modalInstance,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _Session_, _$httpBackend_, _$modal_) {
    scope = $rootScope.$new();
    Session = _Session_;
    $modal = _$modal_;
    $modalInstance = $modal.open({
      template: '<div>blah</div>'
    });
 
    SignupModalInstanceCtrl = $controller('SignupModalInstanceCtrl', {
      $scope: scope,
      $modalInstance: $modalInstance,
      security: Session,
      reason: null
    });

    $rootScope.$digest();
  }));

  it('should signup a user', function () {
    spyOn(Session, 'signup').andCallThrough();
    scope.signup();
    expect(Session.signup).toHaveBeenCalled();
  });

  it('should close modal after successful signup', inject(function ($rootScope) {
    spyOn($modalInstance, 'close')
    scope.signup();
    Session.deferred.resolve();
    $rootScope.$apply(); // "propogates promise resolution to then() call"
    expect($modalInstance.close).toHaveBeenCalled();
  }));
});
