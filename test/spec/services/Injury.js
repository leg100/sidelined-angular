'use strict';

describe('Service: Injury', function () {

  // load the service's module
  beforeEach(module('sidelinedApp'));

  // instantiate service
  var Injury;
  beforeEach(inject(function (_Injury_) {
    Injury = _Injury_;
  }));

  it('should do something', function () {
    expect(!!Injury).toBe(true);
  });

});
