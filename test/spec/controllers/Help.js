'use strict';

describe('Controller: HelpCtrl', function () {
  // load the controller's module
  beforeEach(module('sidelinedApp.help'));

  var HelpCtrl,
    scope,
    AlertBroker,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _AlertBroker_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    AlertBroker = _AlertBroker_;
 
    HelpCtrl = $controller('HelpCtrl', {
      $scope: scope
    });

    scope.help = {
      message: 'help me',
      email: 'bob@fuckoff.me'
    };
  }));

  it('should send help', function () {
    $httpBackend.expect('POST', '/api/help/send_message')
      .respond({ success: true });
    scope.send();
    $httpBackend.flush();
  });

  it('should show alert', function () {
    spyOn(AlertBroker, 'success').andCallThrough();

    $httpBackend.expect('POST', '/api/help/send_message')
      .respond({ success: true });
    scope.send();
    $httpBackend.flush();

    expect(AlertBroker.success).toHaveBeenCalled();
  });
});
