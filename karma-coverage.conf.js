// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-rails-resource/angularjs-rails-resource.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-http-auth/src/http-auth-interceptor.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/spec/**/*.js'
    ],
    basePath: '',
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['Chrome'],
    autoWatch: false,
    singleRun: true,
    colors: true
  });
};
