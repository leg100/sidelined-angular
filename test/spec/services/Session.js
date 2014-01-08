'use strict';

describe('Service: Session', function () {

  // load the service's module
  beforeEach(module('sidelinedApp'));

  // instantiate service
  var Session;
  var $httpBackend, $rootScope, user;
  
  beforeEach(inject(function ($injector, _Session_) {
    Session = _Session_;
    $httpBackend = $injector.get('$httpBackend');
    // shut up the run() block
    $httpBackend.expect('GET', '/api/current-user').respond({
      data: null
    });
    user = {
      user: {
        username: 'bobby_fives',
        password: 'isAFuckingDick',
        passwordConfirmation: 'isAFuckingDick',
        email: 'bobby_fives@dickfuck.xxx'
      }
    };
  }));

  it('should sign in a newly signed up user', function () {
    $httpBackend.expect('POST', '/api/signup').respond({
      success: true,
      data: user.user
    });
    Session.signup(user);
    $httpBackend.flush();
    expect(Session.currentUser).toEqual('bobby_fives');
  });
});
