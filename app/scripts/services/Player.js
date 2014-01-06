'use strict';

angular.module('sidelinedApp')
  .factory('Player', ['railsResourceFactory', function(railsResourceFactory) {
    return railsResourceFactory({
      url: '/api/players',
      name: 'player'
    });
  }]);
