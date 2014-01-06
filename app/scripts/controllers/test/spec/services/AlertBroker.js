'use strict';

describe('Service: Alertbroker', function () {

  // load the service's module
  beforeEach(module('controllersApp'));

  // instantiate service
  var Alertbroker;
  beforeEach(inject(function (_Alertbroker_) {
    Alertbroker = _Alertbroker_;
  }));

  it('should do something', function () {
    expect(!!Alertbroker).toBe(true);
  });

});
