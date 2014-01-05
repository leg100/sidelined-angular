'use strict';

angular.module('sidelinedApp', ['ui.router'])
  .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state('root', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      });
  });
