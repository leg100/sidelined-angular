
angular.module('bookmarkletApp', ['ui.bootstrap', 'sidelinedApp.injuries', 'sidelinedApp.players', 'sidelinedApp.alerts', 'http-auth-interceptor', 'sidelinedApp.auth'])
  .run(['$rootScope', 'Session', function ($rootScope, Session) {
    $rootScope.URL = location.href;
    Session.requestCurrentUser();
  }]);
