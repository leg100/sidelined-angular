'use strict';

xdescribe('Service: Injurylistingservice', function () {

  // load the service's module
  beforeEach(module('sidelinedApp'));

  // instantiate service
  var Injurylistingservice;
  beforeEach(inject(function (_Injurylistingservice_) {
    Injurylistingservice = _Injurylistingservice_;
  }));

  it('should do something', function () {
    expect(!!Injurylistingservice).toBe(true);
  });

});
