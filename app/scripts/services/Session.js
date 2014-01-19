'use strict';

angular.module('sidelinedApp.auth', [])
  .factory('Session', ['$http', '$q', '$location', function($http, $q, $location) {

    function redirect(url) {
      url = url || '/';
      $location.path(url);
    }

    // the public api of the service
    var service = {
      signup: function(username, password, passwordConfirmation, email) {
        $http.defaults.headers.post = {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json'
        };
        return $http.post('/api/users/sign_up', {
          user: {
            username: username,
            password: password,
            // only railsResource performs camelcase2underscore conversion
            password_confirmation: passwordConfirmation,
            email: email
          }
        }).then(function(resp) {
          // nothing to do
        }, function(resp) {
          return $q.reject(resp.data);
        });
      },

      login: function(email, password) {
        $http.defaults.headers.post = {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json'
        };

        return $http.post('/api/users/sign_in', {user: {login: email, password: password}})
          .then( function(resp) {
            if (resp.data.success) {
              service.currentUser = resp.data.data.username;
              return resp.data.data.username;
            } else {
              // reject promise with error message
              return $q.reject(resp.data.info);
            }
          }, function(resp) {
            return $q.reject(resp.data.info);
          });
      },
      // logout the current user and redirect
      logout: function(redirectTo) {
        $http.post('/api/users/sign_out').then(function() {
          service.currentUser = null;
          redirect(redirectTo);
        });
      },
      doRedirect: function(url) {
        redirect(url);
      },
      // ask the backend to see if a user is already authenticated - this may be from a previous session.
      requestCurrentUser: function() {
        if ( !service.isAuthenticated() ) {
          return $http.get('/api/current-user').then(function(response) {
            service.currentUser = response.data.username;
            return service.currentUser;
          });
        }
      },
      currentUser: null,

      isAuthenticated: function(){
        return !!service.currentUser;
      }
    };

    return service;
  }]);
