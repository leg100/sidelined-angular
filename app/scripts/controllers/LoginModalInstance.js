'use strict';

angular.module('sidelinedApp')
  .controller('LoginModalInstanceCtrl', ['$scope', '$modalInstance', 'Session', 'reason', function($scope, $modalInstance, security, reason) {
    $scope.user = {
      email: null,
      password: null
    };

    $scope.authError = null;
    $scope.authReason = reason;

    $scope.login = function() {
      // Clear any previous security errors
      $scope.authError = null;

      security.login($scope.user.email, $scope.user.password).then(function() {
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
