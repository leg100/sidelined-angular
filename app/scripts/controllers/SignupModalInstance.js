'use strict';

angular.module('sidelinedApp')
  .controller('SignupModalInstanceCtrl', ['$scope', '$modalInstance', 'Session', 'reason', function($scope, $modalInstance, security, reason) {
    $scope.user = {
      username: null,
      email: null,
      password: null,
      passwordConfirmation: null
    };

    $scope.authError = null;
    $scope.authReason = reason;

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
      // Clear any previous security errors
      $scope.authError = null;

      // order matters
      security.signup(
        $scope.user.username,
        $scope.user.password,
        $scope.user.passwordConfirmation,
        $scope.user.email
      ).then(function() {
        $modalInstance.close();
      }, function(err) {
        $scope.authError = err;
      });
    };

    $scope.clear = function() {
      $scope.user = {};
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
      security.doRedirect();
    };
  }]);
