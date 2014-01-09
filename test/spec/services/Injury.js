'use strict';

describe('Service: Injury', function () {

  // load the service's module
  beforeEach(module('sidelinedApp.injuries'));

  // instantiate service
  var Injury, $httpBackend;
  beforeEach(inject(function (_Injury_, _$httpBackend_) {
    Injury = _Injury_;
    $httpBackend = _$httpBackend_;
  }));

  it('should revert an injury', function () {
    var promise, result;
    $httpBackend.expect('POST', '/api/injuries/123abc/revert').respond({
       injury
    });
    promise = scope.revert(1);
    promise.then(function(resp) {
      result = resp.data;
    });
    $httpBackend.flush();
    expect(result).toEqual(['p1']);
  });

  it('should retrieve list of all injuries', function () {
    var promise, result;
    $httpBackend.expect('GET', '/api/injuries').respond(['p1']);
    promise = Injury.query();
    promise.then(function(resp) {
      result = resp;
    });
    $httpBackend.flush();
    expect(result).toEqual(['p1']);
  });
});
