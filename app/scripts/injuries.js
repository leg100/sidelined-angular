'use strict';

angular.module('sidelinedApp.injuries', ['rails', 'sidelinedApp.alerts', 'ui.bootstrap', 'sidelinedApp.players'])
  .controller('InjuryFormCtrl', ['$scope', 'Player', 'Injury', 'injury', 'AlertBroker', 'limitToFilter', '$filter', '$state', function($scope, Player, Injury, injury, AlertBroker, limitToFilter, $filter, $state) {

    $scope.injury = injury;
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

    $scope.isNew = true;
    $scope.findExistingInjury = function() {
      Injury.$get('/api/injuries/current', {player_id: $scope.injury.player.id})
        .then(function(resp) {
          // existing injury
          AlertBroker.success('found current injury');
          $scope.injury = resp;
          $scope.isNew = false;
        }, function() {
          AlertBroker.success('found no current injuries');
          $scope.isNew = true;
          $scope.injury = Injury.new_with_defaults({player: $scope.injury.player});
          console.log($scope.injury);
        });
    };

    // trigger add
    $scope.add = function() {
      $scope.injury.create().then(function(resp) {
        $state.go('injury-show', { id: resp.id });
      }, function(err) {
        AlertBroker.error(err.data);
      });
    };

    $scope.update = function() {
      $scope.injury.update().then(function(resp) {
        AlertBroker.success('Updated injury '+ resp.id);
        $state.go('injury-show', {id: resp.id});
      }, function(err) {
        AlertBroker.error(err.data);
      });
    };

    $scope.canSave = function() {
      return $scope.form.$dirty && $scope.form.$valid;
    };

  }])
  .controller('InjuryListCtrl', ['$scope', 'Injury', 'InjuryListingService', 'AlertBroker', 'injuries', '$location', '$state', '$stateParams', function($scope, Injury, InjuryListingService, AlertBroker, injuries, $location, $state, $stateParams) {
    $scope.itemsPerPage = 10;
    $scope.format = 'dd-MMMM-yyyy';
    $scope.injuries = injuries;
    $scope.page = $stateParams.page || 1;
    $scope.totalItems = injuries.$total;
    $scope.maxSize = 10;

    $scope.$on('handleBroadcast', function() {
      Injury.query({page: 1, _type: 'Injury'})
      .then(function(resp) {
        $scope.injuries = resp;
      });
    });

    $scope.updateInjury = function(index) {
      var injury = $scope.injuries[index];
      $state.go('injury-show', { id: injury.id });
    };

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
      $state.go('injuries-by-page', {page: page})
    };
  }])
  .controller('InjuryShowCtrl', ['$scope', '$state', 'Injury', 'AlertBroker', function($scope, $state, Injury, AlertBroker) {
    $scope.$state = $state;
    $scope.$watch('$state.$current.locals.globals.injury', function(injury) {
      $scope.injury = injury;
    });
    $scope.revisionTemplates = {
      create: '/views/revisions/create.html',
      update: '/views/revisions/update.html'
    };
    $scope.revert = function(version) {
      Injury.$post('/api/injuries/'+$scope.injury.id+'/revert', {
        version: version
      }).then(function(resp) {
        $scope.injury = resp;
        AlertBroker.success("updated injury to version "+$scope.injury.version);
      }, function(err) {
        AlertBroker.error(err.data.info);
      });
    };
  }])  
  .factory('Injury', ['railsResourceFactory', 'railsSerializer', function(railsResourceFactory, railsSerializer) {
    var factory = railsResourceFactory({
      url: '/api/injuries',
      name: 'injury',
      pluralName: 'injuries',
      serializer: railsSerializer(function() {
        this.add('player_id', function(injury) {
          return injury.player.id;
        });
        this.exclude('player');
        this.exclude('revisions');
      }),
      interceptors: [{
        'beforeResponse': function(response) {
          if (response.data.meta && response.data.meta.total) {
            response.$total = response.data.meta.total;
          }
          return response;
        },
        'response': function(response) {
          if (response.$total) {
            response.data.$total = response.$total;
          }
          return response;
        }
      }]
    });

    factory.new_with_defaults = function(override) {
      var defaults = {
        status: 'injured',
        player: null,
        source: null,
        quote: null,
        returnDate: null
      }
      if (override) angular.extend(defaults, override);
      return new this(defaults);
    };

    return factory;
}])
  .factory('InjuryListingService', ['$rootScope', function($rootScope) {
    var injuryListingService = {};
    injuryListingService.broadcastItem = function() {
      $rootScope.$broadcast('handleBroadcast');
    };
    return injuryListingService;
  }]);
