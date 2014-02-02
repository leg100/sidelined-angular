'use strict';

angular.module('sidelinedApp.players', ['rails', 'sidelinedApp.injuries', 'sidelinedApp.alerts', 'ui.bootstrap', 'ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/players', '/players/page/1');

    $stateProvider
      .state('players', {
        abstract: true,
        url: '/players',
        templateUrl: '/views/players.html'
      })
      .state('players.show', {
        url: '/:id',
        templateUrl: '/views/pages/player.html',
        controller: 'PlayerShowCtrl',
        resolve: {
          player: ['Player', '$stateParams', '$state', function(Player, $stateParams, $state) {
            return Player.get($stateParams.id);
          }]
        }
      })
      .state('players.update', {
        url: '/:id/update',
        templateUrl: '/views/forms/player.html',
        controller: 'PlayerFormCtrl',
        data: {
          isNew: false
        },
        resolve: {
          clubs: ['Club', function(Club) {
            return Club.query();
          }],
          player: ['Player', 'clubs', '$stateParams', function(Player, clubs, $stateParams) {
            return Player.get($stateParams.id)
              .then(function(p) {
                // find club that belongs to player - needed for object equivalence in ng-options
                for(var i = 0; i < clubs.length; i++) {
                  if (clubs[i].id === p.club.id) { 
                    p.club = clubs[i];
                    return p;
                  }
                }
                // can't find player's club, give up
                return p;
              });
          }]
        }
      })
      .state('players.list', {
        url: '/page/:page',
        templateUrl: '/views/pages/all_players.html',
        controller: 'PlayerListCtrl',
        resolve: {
          players: ['Player', '$stateParams', function(Player, $stateParams) {
            var page = $stateParams.page || 1;
            return Player.query({page: page});
          }]
        }
      });
  }])
  .controller('PlayerFormCtrl', ['$scope', 'Player', 'Injury', 'player', 'clubs', 'AlertBroker', '$state', function($scope, Player, Injury, player, clubs, AlertBroker, $state) {

    $scope.player = player;
    $scope.clubs = clubs;
    $scope.isNew = $state.current.data.isNew;

    $scope.add = function() {
      $scope.player.create().then(function(resp) {
        AlertBroker.success('Added player '+ resp.id);
        $state.go('players.show', { id: resp.id });
      }, function(err) {
        AlertBroker.error(err.data);
      });
    };

    $scope.update = function() {
      $scope.player.update().then(function(resp) {
        AlertBroker.success('Updated player '+ resp.id);
        $state.go('players.show', {id: resp.id});
      }, function(err) {
        AlertBroker.error(err.data);
      });
    };

    $scope.canSave = function() {
      return $scope.form.$dirty && $scope.form.$valid;
    };

    $scope.getClass = function(ngModelCtrl) {
      return {
        'has-success': ngModelCtrl.$dirty && ngModelCtrl.$valid,
        'has-error': ngModelCtrl.$dirty && ngModelCtrl.$invalid
      };
    };
    $scope.showError = function(ngModelCtrl, error) {
      return ngModelCtrl.$error[error];
    };
    $scope.cancel = function() {
      $state.go('players.show', {id: $scope.player.id});
    };

  }])
  .controller('PlayerListCtrl', ['$scope', 'Player', 'AlertBroker', 'players', '$location', '$state', '$stateParams', function($scope, Player, AlertBroker, players, $location, $state, $stateParams) {
    $scope.itemsPerPage = 10;
    $scope.format = 'dd-MMMM-yyyy';
    $scope.players = players;
    $scope.page = $stateParams.page || 1;
    $scope.totalItems = players.$total;
    $scope.maxSize = 10;
    $scope.loading = false;
    $scope.totalPages = $scope.totalItems / $scope.itemsPerPage;

    $scope.showPagination = function() {
      return !$scope.isLoading() && $scope.totalPages > 1;
    };

    $scope.isLoading = function() {
      return $scope.loading;
    };

    $scope.$on('$stateChangeStart', function() {
      $scope.loading = true;
    });

    $scope.$on('$stateChangeSuccess', function() {
      $scope.loading = false;
    });

    $scope.goToPage = function(page) {
      $state.go('players.list', {page: page});
    };
  }])
  .controller('PlayerShowCtrl', ['$scope', '$state', 'Player', 'AlertBroker', 'player', function($scope, $state, Player, AlertBroker, player) {
    $scope.player = player;

    $scope.revert = function(version) {
      $scope.player.revert(version)
        .then(function(resp) {
          $scope.player = resp;
          AlertBroker.success('updated player to version '+$scope.player.version);
        }, function(err) {
          AlertBroker.error(err.data);
        });
    };
  }])  
  .controller('NavbarPlayerCtrl', ['$scope', 'Player', 'limitToFilter', '$filter', '$state', function($scope, Player, limitToFilter, $filter, $state) {
    $scope.player = null;

    // populate typeahead
    $scope.getPlayers = function(substring) {
      return Player.query(
        {typeahead: true}
      ).then(function(resp) {
        return limitToFilter( $filter('filter')(resp, substring), 8);
      });
    };

    $scope.goToPlayerPage = function() {
      var id = $scope.player.id;
      $scope.player = null;
      $state.go('players.show', {id: id });
    };
  }])
  .factory('Player', ['railsResourceFactory', 'railsSerializer', function(railsResourceFactory, railsSerializer) {
    var factory = railsResourceFactory({
      url: '/api/players',
      name: 'player',
      pluralName: 'players',
      serializer: railsSerializer(function() {
        this.add('club_id', function(player) {
          return player.club.id;
        });
        this.exclude('revisions');
        this.resource('club', 'Club');
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
    factory.prototype.revert = function(version) {
      return this.$post(this.$url() + '/revert', {
        version: version
      });
    };

    return factory;
  }])
  .factory('Club', ['railsResourceFactory', 'railsSerializer', function(railsResourceFactory, railsSerializer) {
    var factory = railsResourceFactory({
      url: '/api/clubs',
      name: 'club',
      pluralName: 'clubs',
      serializer: railsSerializer(function() {
        this.exclude('revisions');
        this.exclude('modifier');
        this.exclude('club');
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

    return factory;
  }]);
