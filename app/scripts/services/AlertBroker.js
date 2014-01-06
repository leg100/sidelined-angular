'use strict';

angular.module('sidelinedApp')
  // vidiprinter broker
  .factory('AlertBroker', ['$rootScope', function($rootScope) {
    var alertBroker = {};
    alertBroker.success = function(msg) {
      this.message = msg;
      $rootScope.$broadcast('alert-success');
    };
    alertBroker.error = function(msg) {
      this.message = msg;
      $rootScope.$broadcast('alert-error');
    };
    return alertBroker;
  }]);
  
