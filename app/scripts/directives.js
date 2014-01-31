'use strict';

angular.module('sidelinedApp.directives', [])
  .directive('equals', function() {
    return {
      restrict: 'A', // only activate on element attribute
      require: 'ngModel', // get a hold of NgModelController
      link: function(scope, elem, attrs, ngModel) {
        function validateEqual(val) {
          var other = scope.$eval(attrs.equals);
          var valid = (val === other);
          ngModel.$setValidity('equals', valid);
          return valid ? val : undefined;
        }

        ngModel.$parsers.push(validateEqual);
        ngModel.$formatters.push(validateEqual);

        // watch changes to other value
        scope.$watch(attrs.equals, function() {
          // trigger parsers pipeline
          ngModel.$setViewValue(ngModel.$viewValue);
        });
      }
    };
  })
  .directive('ensureUnique', ['$http', function ($http) {
    return {
      require: 'ngModel',
      link: function postLink(scope, element, attrs, c) {
        var original;
        c.$formatters.unshift(function(modelValue) {
          original = modelValue;
          return modelValue;
        });

        c.$parsers.push(function(viewValue) {
          if (viewValue && viewValue !== original) {
            $http({
              method: 'GET',
              url: '/api/check-availability',
              params: {
                object: attrs.object,
                name: attrs.name,
                value: viewValue
              }
            }).success(function() {
              c.$setValidity('unique', true);
            }).error(function() {
              c.$setValidity('unique', false);
            });
            return viewValue;
          };
        });
      }
    };
  }]);
