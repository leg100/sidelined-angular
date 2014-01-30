'use strict';

angular.module('sidelinedApp.filters', [])
  .filter('capitalize', function() {
    return function (input) {
      return input.charAt(0).toUpperCase() + input.substring(1);
    };
  })
  .filter('timeago', ['$window', function($window){
    return function(date){
      if (typeof date === 'undefined' || date === null) {
        return '';
      }
      return $window.moment(date).fromNow();
    };
  }])
  .filter('sidelined', ['$window', function($window){
    return function(date){
      if (typeof date === 'undefined' || date === null) {
        return 'Return date unknown';
      }
      // we should only get dates in the future
      if ((Date.now() - Date.parse(date)) > 0) {
        return 'Return was due on ' + date;
      }
      return 'Sidelined for ' + $window.moment().from(date, true);
    };
  }])
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
