'use strict';

angular.module('sidelinedApp.alerts', [])
  .controller('AlertCtrl', ['$scope', 'AlertBroker', '$timeout', function($scope, AlertBroker, $timeout) {
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    function closeLastAlert() {
      $scope.alerts.pop();
    }

    function createAlert(type) {
      $scope.alerts.push({
        msg: AlertBroker.message,
        type: type
      });
    }

    function closeAllAlerts() {
      $scope.alerts = [];
    }

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      closeAllAlerts();
    });

    $scope.$on('alert-success', function() {
      createAlert('success');
    });

    $scope.$on('alert-error', function() {
      createAlert('danger');
    });
  }])
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
  
