'use strict';

angular.module('sidelinedApp')
  .controller('SignupCtrl', ['$scope', 'Session', 'AlertBroker', function($scope, security, AlertBroker) {
    $scope.user = {
      username: null,
      email: null,
      password: null,
      passwordConfirmation: null
    };
    $scope.done = false;

    $scope.getClass = function(ngModelCtrl) {
      return {
        'has-success': ngModelCtrl.$dirty && ngModelCtrl.$valid,
        'has-error': ngModelCtrl.$dirty && ngModelCtrl.$invalid
      };
    };
    $scope.showError = function(ngModelCtrl, error) {
      return ngModelCtrl.$error[error];
    };

    $scope.signup = function() {
      security.signup(
        // order matters
        $scope.user.username,
        $scope.user.password,
        $scope.user.passwordConfirmation,
        $scope.user.email
      ).then(function() {
        $scope.done = true;
      }, function(err) {
        AlertBroker.error(err);
      });
    };
  }]);
