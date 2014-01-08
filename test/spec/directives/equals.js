'use strict';

describe('Directive: equals', function () {

  // load the directive's module
  beforeEach(module('sidelinedApp.directives'));

  var element,
    scope,
    form,
    $compile;

  beforeEach(inject(function ($rootScope, _$compile_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
    scope.model = {
      value1: null,
      value2: null
    };
    element = $compile(
      '<form name="form">' +
        '<input name="value1" type="text" ng-model="model.value1" equals="model.value2"/>' +
        '<input name="value2" type="text" ng-model="model.value2"/>' +
      '</form>')(scope);
    scope.$digest();
    form = scope.form;
  }));

  describe('model value changes', function() {
    it('should be invalid if model changes', inject(function () {
      scope.model.value1 = 'abc';
      scope.$digest();
      expect(form.value1.$invalid).toBe(true);
    }));
    it('should be invalid if the other model changes', inject(function () {
      scope.model.value2 = 'abc';
      scope.$digest();
      expect(form.value1.$invalid).toBe(true);
    }));
    it('should be valid if the two models are the same', inject(function () {
      scope.model.value2 = 'abc';
      scope.$digest();
      expect(form.value1.$invalid).toBe(true);

      scope.model.value1 = 'abc';
      scope.$digest();
      expect(form.value1.$valid).toBe(true);
      expect(form.value2.$valid).toBe(true);
    }));
    it('it should show correct values in input', inject(function () {
      scope.model.value1 = 'abc';
      scope.model.value2 = 'abc';
      scope.$digest();
      expect(form.value1.$viewValue).toBe('abc');
      expect(form.value2.$viewValue).toBe('abc');
    }));
  });

  describe('input value changes', function() {
    it('should be invalid if input changes', inject(function () {
      form.value1.$setViewValue('abc');
      expect(form.value1.$valid).toBe(false);
      expect(scope.model.value1).toBe(undefined); // checks parser sets undefined
    }));
    it('should be valid if input is same as the reference', inject(function () {
      scope.model.value2 = 'abc';
      scope.$digest();
      expect(form.value1.$invalid).toBe(true);

      form.value1.$setViewValue('abc');
      expect(form.value1.$viewValue).toBe('abc'); // pointless?
      expect(form.value1.$valid).toBe(true);
    }));
  });
});
