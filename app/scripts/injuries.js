'use strict';

angular.module('sidelinedApp.injuries', ['rails', 'sidelinedApp.alerts', 'ui.bootstrap', 'sidelinedApp.players'])
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
        returnDate: $scope.injury.returnDate
      }).create().then(function() {
        AlertBroker.success('Added new injury to '+ $scope.injury.player.tickerAndName);
        InjuryListingService.broadcastItem();
      }, function(err) {
        AlertBroker.error(err.data);
      });
    };

    $scope.canSave = function() {
      return $scope.form.$dirty && $scope.form.$valid;
    };
  }])
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
  }])
  .controller('InjuryListCtrl', ['$scope', 'Injury', 'InjuryListingService', 'AlertBroker', 'injuries', '$location', 'action', function($scope, Injury, InjuryListingService, AlertBroker, injuries, $location, action) {
    $scope.itemsPerPage = 100;
    $scope.format = 'dd-MMMM-yyyy';
    $scope.injuries = injuries;
    $scope.currentPage = 1; //$routeParams.page || 1;
    $scope.totalItems = injuries.$total;
    $scope.maxSize = 10;
    $scope.action = action;

    $scope.$on('handleBroadcast', function() {
      Injury.query({page: 1, _type: 'Injury'})
      .then(function(resp) {
        $scope.injuries = resp;
      });
    });

    $scope.removeInjury = function(index) {
      var injury = $scope.injuries[index];

      injury.remove().then(function(resp){
        Injury.query({page: 1})
        .then(function(resp) {
          $scope.injuries = resp;
        });
        AlertBroker.success('Removed injury '+ resp.id);
      });
    };

    $scope.goToPage = function(page) {
      $location.path('/all/'+ page);
    };
  }])
  .factory('Injury', ['railsResourceFactory', function(railsResourceFactory) {
    return railsResourceFactory({
      url: '/api/injuries',
      name: 'injury',
      pluralName: 'injuries',
      responseInterceptors: [function(promise) {
        return promise.then(function(response) {
          if (response.originalData.meta) {
            response.data.$total = response.originalData.meta.total;
          }
          return response;
        });
      }]
    });
  }])
  .factory('InjuryListingService', ['$rootScope', function($rootScope) {
    var injuryListingService = {};
    injuryListingService.broadcastItem = function() {
      $rootScope.$broadcast('handleBroadcast');
    };
    return injuryListingService;
  }]);
