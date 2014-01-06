'use strict';

angular.module('sidelinedApp')
  .controller('LoginModalCtrl', ['$scope', 'Session', '$modal', 'authService', function($scope, security, $modal, authService) {

    $scope.open = function(reason) {
      var modalInstance = $modal.open({
        templateUrl: '/views/auth/modal.html',
        controller: 'LoginModalInstanceCtrl',
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

    $scope.$on('event:auth-loginRequired', function() {
      $scope.open('not authenticated');
    });
  }]);
