'use strict';

angular.module('sidelinedApp', ['sidelinedApp.directives', 'sidelinedApp.injuries', 'sidelinedApp.auth', 'sidelinedApp.help', 'ui.router', 'rails', 'ui.bootstrap', 'http-auth-interceptor'])
  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$uiViewScrollProvider', function($locationProvider, $stateProvider, $urlRouterProvider, $uiViewScrollProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.otherwise('/injuries');
    $uiViewScrollProvider.useAnchorScroll();

    $stateProvider
    .state('newinjury', {
      url: '/injuries/new',
      templateUrl: '/views/forms/injury.html',
      controller: 'InjuryFormCtrl',
      resolve: {
        injury: ['Injury', function(Injury) {
          return Injury.new_with_defaults();
        }]
      }
    })
    .state('injury-update', {
      url: '/injuries/:id/update',
      templateUrl: '/views/forms/injury.html',
      controller: 'InjuryFormCtrl',
      resolve: {
        injury: ['Injury', '$stateParams', function(Injury, $stateParams) {
          return Injury.get($stateParams.id);
        }]
      }
    })
    .state('injuries-by-page', {
      url: '/injuries/page/:page',
      templateUrl: '/views/pages/all.html',
      controller: 'InjuryListCtrl',
      resolve: {
        injuries: ['Injury', '$stateParams', function(Injury, $stateParams) {
          return Injury.query({page: $stateParams.page});
        }]
      }
    })
    .state('injury-show', {
      url: '/injuries/:id',
      templateUrl: '/views/pages/injury.html',
      controller: 'InjuryShowCtrl',
      resolve: {
        injury: ['Injury', '$stateParams', function(Injury, $stateParams) {
          return Injury.get($stateParams.id);
        }]
      }
    })
    .state('injuries', {
      url: '/injuries{trailing:\/?}',
      templateUrl: '/views/pages/all.html',
      controller: 'InjuryListCtrl',
      resolve: {
        injuries: ['Injury', function(Injury) {
          return Injury.query();
        }]
      }
    })
    .state('signup', {
      templateUrl: '/views/auth/signup.html',
      url: '/signup',
      controller: 'SignupCtrl'
    })
    .state('confirmed', {
      url: '/confirmed?status',
      controller: ['AlertBroker', '$state', '$stateParams', function(AlertBroker, $state, $stateParams) {
        if ($stateParams.status == 'success') {
          AlertBroker.success('Successfully confirmed your signup');
        }
        if ($stateParams.status == 'failure') {
          AlertBroker.error('There was an error confirming your signup');
        }
      }]
    })
    .state('help', {
      templateUrl: '/views/pages/help.html',
      url: '/help',
      controller: 'HelpCtrl'
    })
    .state('error', {
      template: '<h1>HTTP500</h1>',
      url: '/error'
    });
  }]).run(['Session', function(Session) {
    Session.requestCurrentUser();
  }]);
