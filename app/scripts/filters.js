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
      time = Date.parse(time);
      var now = new Date();

      var seconds = (now - time) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
   
      return seconds < 45 && appendString(seconds, 's') ||
        minutes < 45 && appendString(minutes, 'm') ||
        hours < 24 && appendString(hours, 'h') ||
        dateFilter(originalTime, 'd MMM');
    };
  })
  .filter('longAgo', function($filter) {
    var dateFilter = $filter('date');

    var appendString = function(d, s) {
      return 'Sidelined for '+ Math.abs(Math.round(d)) + ' ' + s;
    };
   
    return function(time) {
      if (!time) {
        return 'Unknown return date';
      }

      time = Date.parse(time);
      var now = Date.now();

      if (time < now) {
        return null;
      }

      var seconds = (time - now) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var weeks = days / 7;
      var months = weeks / 4;
   
      return days < 2 && appendString(days, 'day') ||
        days < 7 && appendString(days, 'days') ||
        weeks < 2 && appendString(weeks, 'week') ||
        weeks < 4 && appendString(weeks, 'weeks') ||
        months < 2 && appendString(months, 'month') ||
        appendString(months, 'months');
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
