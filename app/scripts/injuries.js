'use strict';

angular.module('sidelinedApp.injuries', ['rails', 'sidelinedApp.alerts', 'ui.bootstrap', 'sidelinedApp.players', 'ui.router'])
  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$uiViewScrollProvider', function($locationProvider, $stateProvider, $urlRouterProvider, $uiViewScrollProvider) {

    $stateProvider
      .state('injuries', {
        abstract: true,
        url: '/injuries',
        templateUrl: '/views/injuries.html'
      })
      .state('injuries.new', {
        url: '/new',
        templateUrl: '/views/forms/injury.html',
        controller: 'InjuryFormCtrl',
        data: {
          isNew: false
        },
        resolve: {
          injury: ['Injury', function(Injury) {
            return Injury.newWithDefaults();
          }]
        }
      })
      .state('injuries.update', {
        url: '/:id/update',
        templateUrl: '/views/forms/injury.html',
        controller: 'InjuryFormCtrl',
        data: {
          isNew: false
        },
        resolve: {
          injury: ['Injury', '$stateParams', function(Injury, $stateParams) {
            return Injury.get($stateParams.id);
          }]
        }
      })
      .state('injuries.show', {
        url: '/:id',
        templateUrl: '/views/pages/injury.html',
        controller: 'InjuryShowCtrl',
        resolve: {
          injury: ['Injury', '$stateParams', function(Injury, $stateParams) {
            return Injury.get($stateParams.id);
          }]
        }
      })
      .state('injuries.list', {
        url: '/page/:page',
        templateUrl: '/views/pages/all.html',
        controller: 'InjuryListCtrl',
        resolve: {
          injuries: ['Injury', '$stateParams', function(Injury, $stateParams) {
            var page = $stateParams.page || 1;
            return Injury.query({page: page});
          }]
        }
      })
  }])
  .controller('InjuryFormCtrl', ['$scope', 'Player', 'Injury', 'injury', 'AlertBroker', 'limitToFilter', '$filter', '$state', function($scope, Player, Injury, injury, AlertBroker, limitToFilter, $filter, $state) {

    $scope.injury = injury;
    $scope.isNew = $state.current.data.isNew;
    $scope.isBookmarklet = $state.current.data.isBookmarklet;
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

    $scope.findExistingInjury = function() {
      Injury.$get('/api/injuries/current', {player_id: $scope.injury.player.id})
        .then(function(resp) {
          // existing injury
          AlertBroker.success('found current injury');
          $scope.injury = angular.extend(resp, $scope.injury);
          $scope.isNew = false;
        }, function() {
          AlertBroker.success('found no current injuries');
          $scope.isNew = true;
          var resetInjury = Injury.newWithDefaults({player: $scope.injury.player});
          if ($scope.isBookmarklet) { resetInjury.source = $scope.injury.source; }
          $scope.injury = resetInjury;
        });
    };

    // trigger add
    $scope.add = function() {
      $scope.injury.create().then(function(resp) {
        AlertBroker.success('Added injury '+ resp.id);
        $state.go('injuries.show', { id: resp.id });
      }, function(err) {
        AlertBroker.error(err.data);
      });
    };

    $scope.update = function() {
      $scope.injury.update().then(function(resp) {
        AlertBroker.success('Updated injury '+ resp.id);
        $state.go('injuries.show', {id: resp.id});
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
      $state.go('injuries.show', { id: injury.id });
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
      $state.go('injuries.list', {page: page});
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
        AlertBroker.success('updated injury to version '+$scope.injury.version);
      }, function(err) {
        AlertBroker.error(err.data.info);
      });
    };
  }])
  .factory('Diff', function() {
    return JsDiff;
  })
  .controller('RevisionCtrl', ['Diff', '$scope', '$state', 'Injury', 'AlertBroker', function(Diff, $scope, $state, Injury, AlertBroker) {
  }])
  .directive('diff', ['Diff', function(Diff) {
    return {
      restrict: 'E', // only activate on element attribute
      link: function(scope, elem, attrs) {
        var orig = scope.$eval(attrs.orig);
        var mod = scope.$eval(attrs.mod);
        var diffs = [];
        var html = '<pre>';

        for(var k in mod) {
          var origH = {}, modH = {};
          modH[k] = mod[k];
          if (orig[k]) {
            origH[k] = orig[k];
          }

          var origString = JSON.stringify(origH).replace(/[\{\}]/gm, '');
          var modString = JSON.stringify(modH).replace(/[\{\}]/gm, '');

          Diff.diffLines(origString, modString).forEach(function(d) {
            var val = d.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            var klass = d.added ? 'green' : d.removed ? 'red' : 'grey';
            html = html + '<span class="'+ klass +'">'+ val + '</span>';
          });
        }
        elem.append(html +'</pre>');
      }
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

    factory.newWithDefaults = function(override) {
      var defaults = {
        status: 'injured',
        player: null,
        source: null,
        quote: null,
        returnDate: null
      };
      if (override) { angular.extend(defaults, override); }
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
