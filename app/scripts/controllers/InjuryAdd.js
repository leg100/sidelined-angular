'use strict';

angular.module('sidelinedApp')
  .controller('InjuryAddCtrl', ['$scope', 'Player', 'Injury', 'InjuryListingService', 'AlertBroker', 'limitToFilter', '$filter', function($scope, Player, Injury, InjuryListingService, AlertBroker, limitToFilter, $filter) {
    // init params
    $scope.injury = {
      status: 'confirmed',
      player: null,
      source: null,
      quote: null,
      returnDate: null
    };

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

    // populate typeahead
    $scope.getPlayers = function(substring) {
      return Player.query(
        {typeahead: true}
      ).then(function(resp) {
        return limitToFilter( $filter('filter')(resp, substring), 8);
      });
    };

    // trigger add
    $scope.add = function() {
      new Injury({
        status: $scope.injury.status,
        source: $scope.injury.source,
        quote: $scope.injury.quote,
        player: $scope.injury.player.id,
        return_date: $scope.injury.returnDate
      }).create().then(function(injury) {
        AlertBroker.success('Added new injury to '+ $scope.injury.player.tickerAndName);
        InjuryListingService.broadcastItem();
      }, function(err) {
        AlertBroker.error(err.data);
      });
    };

    $scope.canSave = function() {
      return $scope.form.$dirty && $scope.form.$valid;
    };
  }]);
