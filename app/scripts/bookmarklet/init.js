'use strict';

angular.module('bookmarkletApp', ['sidelinedApp.filters', 'ui.router', 'ui.bootstrap', 'sidelinedApp.injuries', 'sidelinedApp.players', 'sidelinedApp.alerts', 'http-auth-interceptor', 'sidelinedApp.auth', 'ui.bootstrap'])
  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('bookmarklet', {
      url: '/',
      templateUrl: '/views/forms/injury.html',
      controller: 'InjuryFormCtrl',
      data: {
        isNew: true,
        isBookmarklet: true
      },
      resolve: {
        injury: ['Injury', function(Injury) {
          var url = (window.location !== window.parent.location) ? document.referrer: document.location;
          return Injury.newWithDefaults({source: url});
        }]
      }
    })
    .state('injury-show', {
      url: '/injuries/:id',
      templateUrl: '/views/bookmarklet/show.html',
      controller: 'InjuryShowCtrl',
      resolve: {
        injury: ['Injury', '$stateParams', function(Injury, $stateParams) {
          return Injury.get($stateParams.id);
        }]
      }
    })
    .state('login', {
      templateUrl: '/views/bookmarklet/login.html',
      controller: 'LoginFormController'
    })
    .state('error', {
      template: '<h1>HTTP500</h1>',
      url: '/error'
    });
  }])
  .run(['$rootScope', 'Session', function ($rootScope, Session) {
    Session.requestCurrentUser();
  }])
  .controller('BookmarkletController', ['$scope', 'Player', 'limitToFilter', '$filter', 'AlertBroker', 'Injury', '$state', function($scope, Player, limitToFilter, $filter, AlertBroker, Injury, $state) {
    $scope.close = function() {
      window.parent.closeSidelinedIFrame();
    };

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
        AlertBroker.success('logged in');
        authService.loginConfirmed();
        $state.go('bookmarklet');
      }, function() {
        AlertBroker.error('authentication failed');
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
