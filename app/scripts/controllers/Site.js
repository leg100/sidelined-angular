'use strict';

angular.module('sidelinedApp')
  .controller('SiteCtrl', ['$state', '$scope', function ($state, $scope) {
    $scope.$on('$stateChangeError', function() {
      $state.go('error', {}, {location: true, reload: true});
    });
  }]);
