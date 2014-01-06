'use strict';

angular.module('sidelinedApp')
  .factory('InjuryListingService', ['$rootScope', function($rootScope) {
    var injuryListingService = {};
    injuryListingService.broadcastItem = function() {
      $rootScope.$broadcast('handleBroadcast');
    };
    return injuryListingService;
  }]);
