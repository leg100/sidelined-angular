'use strict';

angular.module('bookmarkletApp')
  .controller('BookmarkletController', ['$scope', 'Player', 'limitToFilter', '$filter', 'AlertBroker', 'Injury', function($scope, Player, limitToFilter, $filter, AlertBroker, Injury) {
    $scope.close = function() {
      window.parent.closeSidelinedIFrame();
    }

    $scope.$on('event:auth-loginRequired', function() {
      $scope.showLogin = true;
    });

    $scope.toggleShowLogin = function() {
      if ($scope.showLogin) {
        $scope.showLogin = false;
      } else {
        $scope.showLogin = true;
      }
    };

  }])
  .controller('LoginStatusController', ['$scope', 'Player', 'limitToFilter', '$filter', 'AlertBroker', 'Injury', 'Session', function($scope, Player, limitToFilter, $filter, AlertBroker, Injury, security) {

    $scope.isAuthenticated = security.isAuthenticated;
    $scope.$watch(function() {
      return security.currentUser;
    }, function(currentUser) {
      $scope.username = currentUser;
    });

    $scope.logout = security.logout;

  }])
  .controller('LoginFormController', ['$scope', 'Player', 'limitToFilter', '$filter', 'AlertBroker', 'Injury', 'Session', 'authService', function($scope, Player, limitToFilter, $filter, AlertBroker, Injury, security, authService) {

    $scope.user = {
      email: null,
      password: null
    };

    $scope.login = function() {
      security.login($scope.user.email, $scope.user.password).then(function() {
        AlertBroker.success("logged in");
        authService.loginConfirmed();
        $scope.toggleShowLogin();
      }, function(err) {
        AlertBroker.error("authentication failed");
      });
    };

    $scope.cancel = function() {
      $scope.toggleShowLogin();
    };

    $scope.getClass = function(ngModelCtrl) {
      return {
        'has-success': ngModelCtrl.$dirty && ngModelCtrl.$valid,
        'has-error': ngModelCtrl.$dirty && ngModelCtrl.$invalid
      };
    };

    $scope.showError = function(ngModelCtrl, error) {
      return ngModelCtrl.$dirty && ngModelCtrl.$error[error];
    };

  }])
  .controller('InjuryController', ['$scope', 'Player', 'limitToFilter', '$filter', 'AlertBroker', 'Injury', function($scope, Player, limitToFilter, $filter, AlertBroker, Injury) {

    $scope.injury = new Injury({
      status: 'confirmed',
      player: null,
      source: $scope.URL,
      quote: null,
      returnDate: null
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
          console.log(resp);
          AlertBroker.success('found current injury');
          $scope.injury = resp;
          $scope.isNew = false;
        }, function() {
          AlertBroker.success('found no current injuries');
          $scope.isNew = true;
        });
    };

    // trigger add
    $scope.add = function() {
      $scope.injury.create().then(function() {
        AlertBroker.success('Added new injury to '+ $scope.injury.player.tickerAndName);
        $scope.injury = {};
      }, function(err) {
        AlertBroker.error(err.data);
      });
    };

    $scope.update = function() {
      $scope.injury.update().then(function(resp) {
        AlertBroker.success('Updated injury '+ resp.id);
      }, function(err) {
        AlertBroker.error(err.data);
      });
    };

    $scope.cancel = function() {
      // remove iframe
      parent.closeIFrame();
    };
  }]);
