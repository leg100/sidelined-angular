'use strict';

angular.module('sidelinedApp.help', ['sidelinedApp.alerts'])
  .controller('HelpCtrl', ['$scope', '$http', 'AlertBroker', function($scope, $http, AlertBroker) {
    $scope.help = {
      email: null,
      message: null
    };

    // trigger add
    $scope.send = function() {
      $http.defaults.headers.post = {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      };

      return $http.post('/api/help/send_message', {
        help: $scope.help
      }).then(function() {
        AlertBroker.success('Your message has been sent.');
        $scope.help = {};
      }, function(resp) {
        AlertBroker.error(resp.data);
      });
    };

    $scope.canSend = function() {
      return $scope.form.$dirty && $scope.form.$valid;
    };
  }]);
