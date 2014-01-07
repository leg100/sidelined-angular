'use strict';

angular.module('sidelinedApp.players', ['rails'])
  .factory('Player', ['railsResourceFactory', function(railsResourceFactory) {
    return railsResourceFactory({
      url: '/api/players',
      name: 'player'
    });
  }]);
