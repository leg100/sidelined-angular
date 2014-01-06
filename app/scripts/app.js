'use strict';

angular.module('sidelinedApp', ['ui.router', 'rails', 'ui.bootstrap', 'http-auth-interceptor'])
.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/injuries');
  $stateProvider
  .state('injuries', {
    url: '/injuries{trailing:\/?}',
    templateUrl: '/views/pages/all.html',
    controller: 'InjuryListCtrl',
    resolve: {
      action: function() {
        return 'add';
      },
      injuries: function(Injury) {
        return Injury.query();
      }
    }
  })
  .state('injury', {
    url: '/injuries/:id',
    templateUrl: '/views/pages/injury.html',
    controller: function($scope, $state, action) {
      $scope.action = action;
      $scope.$state = $state;
      $scope.$watch('$state.$current.locals.globals.injury', function(injury) {
        $scope.injury = injury;
      });
      $scope.revision_templates = {
        create: '/views/revisions/create.html',
        update: '/views/revisions/update.html'
      };
    },
    resolve: {
      action: function() {
        return 'update';
      },
      injury: function(Injury, $stateParams) {
        return Injury.get($stateParams.id);
      }
    }
  });
}).run(function(Session) {
  Session.requestCurrentUser();
});
