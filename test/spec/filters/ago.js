'use strict';

describe('Filter: ago', function () {

  // load the filter's module
  beforeEach(module('sidelinedApp'));

  // initialize a new instance of the filter before each test
  var ago;
  beforeEach(inject(function ($filter) {
    ago = $filter('ago');
  }));

  it('should return the input prefixed with "ago filter:"', function () {
    var text = 'angularjs';
    expect(ago(text)).toBe('ago filter: ' + text);
  });

});
