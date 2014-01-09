'use strict';

angular.module('sidelinedApp', ['sidelinedApp.directives', 'sidelinedApp.injuries', 'ui.router', 'rails', 'ui.bootstrap', 'http-auth-interceptor'])
.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
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
      injuries: ['Injury', function(Injury) {
        return Injury.query();
      }]
    }
  })
  .state('injury', {
    url: '/injuries/:id',
    templateUrl: '/views/pages/injury.html',
    controller: 'InjuryShowCtrl',
   
    resolve: {
      action: function() {
        return 'update';
      },
      injury: ['Injury', '$stateParams', function(Injury, $stateParams) {
        return Injury.get($stateParams.id);
      }]
    }
  });
}]).run(['Session', function(Session) {
  Session.requestCurrentUser();
}]);
