'use strict';

angular.module('bookmarkletApp')
  .controller('BookmarkletController', ['$scope', 'Player', 'limitToFilter', '$filter', 'AlertBroker', 'Injury', '$state', function($scope, Player, limitToFilter, $filter, AlertBroker, Injury, $state) {
    $scope.close = function() {
      window.parent.closeSidelinedIFrame();
    }

    $scope.$on('event:auth-loginRequired', function() {
      $state.go('login');
    });
  }])
  .controller('LoginStatusController', ['$scope', 'Player', 'limitToFilter', '$filter', 'AlertBroker', 'Injury', 'Session', function($scope, Player, limitToFilter, $filter, AlertBroker, Injury, security) {

    $scope.isAuthenticated = security.isAuthenticated;
    $scope.$watch(function() {
      return security.currentUser;
    }, function(currentUser) {
      $scope.username = currentUser;
    });

    $scope.logout = security.logout;

  }])
  .controller('LoginFormController', ['$scope', 'Player', 'limitToFilter', '$filter', 'AlertBroker', 'Injury', 'Session', 'authService', '$state', function($scope, Player, limitToFilter, $filter, AlertBroker, Injury, security, authService, $state) {

    $scope.user = {
      email: null,
      password: null
    };

    $scope.login = function() {
      security.login($scope.user.email, $scope.user.password).then(function() {
        AlertBroker.success("logged in");
        authService.loginConfirmed();
        $state.go('bookmarklet');
      }, function(err) {
        AlertBroker.error("authentication failed");
      });
    };

    $scope.cancel = function() {
      $state.go('bookmarklet');
    };

    $scope.getClass = function(ngModelCtrl) {
      return {
        'has-success': ngModelCtrl.$dirty && ngModelCtrl.$valid,
        'has-error': ngModelCtrl.$dirty && ngModelCtrl.$invalid
      };
    };

    $scope.showError = function(ngModelCtrl, error) {
      return ngModelCtrl.$dirty && ngModelCtrl.$error[error];
    };

  }]);
