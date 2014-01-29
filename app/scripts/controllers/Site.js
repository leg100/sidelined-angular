'use strict';

angular.module('sidelinedApp')
  .controller('SiteCtrl', ['$state', '$scope', function ($state, $scope) {
    $scope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, err) {
      console.dir(err);
      $state.go('error', {}, {location: true, reload: true});
    });
  }]);
