'use strict';

/*
 * @ngdoc function
 * @name yiting007githubioApp.controller:digitCtrl
 * @description
 * # dropdownCtrl
 * Controller of the yiting007githubioApp
 */
angular.module('yiting007githubioApp')
  .controller('dropdownCtrl', function ($scope) {
      $scope.items = [{
          name: 'This is the main title 1',
          title: 'This is the sub title a'
      }, {
          name: 'This is the main title 2',
          title: 'This is the sub title b'
      }];

      $scope.assignItem = function(item) {
          $scope.$broadcast('newItem', [item]);
      };
});
