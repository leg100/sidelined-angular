'use strict';

angular.module('sidelinedApp.filters', [])
  .filter('capitalize', function() {
    return function (input) {
      return input.charAt(0).toUpperCase() + input.substring(1);
    };
  })
  .filter('ago', function($filter) {
    var dateFilter = $filter('date');

    var appendString = function(d, s) {
      return Math.abs(Math.round(d)) + s;
    };
   
    return function(time) {
      if (!time) {
        return 'Never';
      }
      var originalTime = time;

      time = time.replace(/\.\d+/, '');
      time = time.replace(/-/, '/').replace( /-/, '/');
      time = time.replace(/T/, ' ').replace(/Z/, ' UTC');
      time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2');
      time = new Date(time * 1000) || time;

      var now = new Date();
      var seconds = now.getTime() - time;
      var minutes = seconds / 60;
      var hours = minutes / 60;
   
      return seconds < 45 && appendString(seconds, 's') ||
        minutes < 45 && appendString(minutes, 'm') ||
        hours < 24 && appendString(hours, 'h') ||
        dateFilter(originalTime, 'd MMM');
    };
  })
  .filter('domain', function() {
    return function (input) {
      var matches,
          output = '',
          urls = /\w+:\/\/([\w|\.]+)/;

      matches = urls.exec( input );

      if (matches !== null) { output = matches[1] };

      return output;
    };
  });
