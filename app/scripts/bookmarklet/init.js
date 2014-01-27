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
  }]);
