'use strict';

angular.module('sidelinedApp')
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
  }]);
