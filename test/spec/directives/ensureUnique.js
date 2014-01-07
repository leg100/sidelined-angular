'use strict';

describe('Directive: ensureUnique', function () {

  // load the directive's module
  beforeEach(module('sidelinedApp.directives'));

  var element,
    scope,
    form,
    $compile,
    $httpBackend;

  beforeEach(inject(function ($injector, $rootScope, _$compile_) {
    $httpBackend = $injector.get('$httpBackend');

    scope = $rootScope.$new();
    $compile = _$compile_;
    scope.model = {
      user: null
    };
    element = $compile(
      '<form name="form">' +
        '<input name="user" type="text" ng-model="model.user" ensure-unique/>' +
      '</form>')(scope);
    scope.$digest();
    form = scope.form;
  }));

  it('should call /api when view changes', inject(function () {
    $httpBackend.expect(
      'GET', 
      '/api/check-availability?name=user&value=bobby_fives'
    ).respond(null);
    form.user.$setViewValue('bobby_fives');
    $httpBackend.flush();
  }));

  it('should set model to valid if response is 200', inject(function () {
    $httpBackend.expect(
      'GET', 
      '/api/check-availability?name=user&value=bobby_fives'
    ).respond(200, '');
    form.user.$setViewValue('bobby_fives');
    $httpBackend.flush();
    expect(form.user.$valid).toBe(true);
  }));

  it('should set model to invalid if response not 2xx', inject(function () {
    $httpBackend.expect(
      'GET', 
      '/api/check-availability?name=user&value=bobby_fives'
    ).respond(409, '');
    form.user.$setViewValue('bobby_fives');
    $httpBackend.flush();
    expect(form.user.$valid).toBe(false);
  }));
});
