'use strict';

angular.module('sidelinedApp')
  .controller('InjuryEditCtrl', ['$scope', 'Injury', 'AlertBroker', '$state', function($scope, Injury, AlertBroker, $state) {

    $scope.$watch('$state.$current.locals.globals.injury', function(injury) {
      $scope.injury = injury;
    });

    // datepicker
    $scope.dateOptions = {
      'year-format': 'yy',
      'starting-day': 1
    };
    $scope.today = function() {
      $scope.minDate = new Date();
    };
    $scope.today();
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.canUpdate = function() {
      return $scope.form.$dirty && $scope.form.$valid;
    };

    $scope.update = function() {
      $scope.injury.update().then(function(resp) {
        AlertBroker.success('Updated injury '+ resp.id);
        // re retrieve injury
        $state.reload();
      }, function(err) {
        AlertBroker.error(err.data);
      });
    };
  }]);

