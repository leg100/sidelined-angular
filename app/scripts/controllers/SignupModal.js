'use strict';

angular.module('sidelinedApp')
  .controller('SignupModalCtrl', ['$scope', 'Session', '$modal', 'authService', function($scope, security, $modal, authService) {

    $scope.open = function(reason) {
      var modalInstance = $modal.open({
        templateUrl: '/views/auth/signup-modal.html',
        controller: 'SignupModalInstanceCtrl',
        resolve: {
          reason: function() {
            return (reason || null);
          }
        }
      });
      modalInstance.result.then(function() {
        authService.loginConfirmed();
      }, function() {
        security.doRedirect();
      });
    };
  }]);
