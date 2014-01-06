'use strict';

angular.module('sidelinedApp')
  .filter('capitalize', function() {
    return function (input) {
      return input.charAt(0).toUpperCase() + input.substring(1);
    };
  });
