'use strict';

angular.module('sidelinedApp')
  .controller('LoginStatusCtrl', ['$scope', 'Session', function($scope, security) {
    $scope.isAuthenticated = security.isAuthenticated;
    $scope.$watch(function() {
      return security.currentUser;
    }, function(currentUser) {
      $scope.username = currentUser;
    });
    $scope.logout = security.logout;
  }]);
