'use strict';

angular.module('sidelinedApp', ['sidelinedApp.filters', 'sidelinedApp.directives', 'sidelinedApp.players', 'sidelinedApp.injuries', 'sidelinedApp.auth', 'sidelinedApp.help', 'ui.router', 'rails', 'ui.bootstrap', 'http-auth-interceptor', 'sidelinedApp.breadcrumbs'])
  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$uiViewScrollProvider', function($locationProvider, $stateProvider, $urlRouterProvider, $uiViewScrollProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.otherwise('/injuries/page/1');
    $uiViewScrollProvider.useAnchorScroll();

    $stateProvider
      .state('signup', {
        templateUrl: '/views/auth/signup.html',
        url: '/signup',
        controller: 'SignupCtrl'
      })
      .state('confirmed', {
        url: '/confirmed?status',
        controller: ['AlertBroker', '$state', '$stateParams', function(AlertBroker, $state, $stateParams) {
          if ($stateParams.status === 'success') {
            AlertBroker.success('Successfully confirmed your signup');
          }
          if ($stateParams.status === 'failure') {
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
  }]).run(['Session', '$rootScope', '$state', '$stateParams', function(Session, $rootScope, $state, $stateParams) {
    Session.requestCurrentUser();

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }]);
