'use strict';

xdescribe('Service: Session', function () {

  // load the service's module
  beforeEach(module('sidelinedApp'));

  // instantiate service
  var Session;
  var $httpBackend, $rootScope;
  
  beforeEach(inject(function ($injector, _Session_) {
    //Session = _Session_;
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/api/current-user').respond(null);
    //$rootScope = $injector.get('$rootScope');
  }));

  it('should do something', function () {
    expect(!!Session).toBe(true);
  });

});
