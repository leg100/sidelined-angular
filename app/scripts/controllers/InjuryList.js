'use strict';

angular.module('sidelinedApp')
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
        AlertBroker.success("Removed injury "+ resp.id);
      });
    };

    $scope.goToPage = function(page) {
      $location.path('/all/'+ page);
    };
  }]);
