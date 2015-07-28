'use strict';

/**
 * @ngdoc function
 * @name yiting007githubioApp.controller:NavlistCtrl
 * @description
 * # NavlistCtrl
 * Controller of the yiting007githubioApp
 */
angular.module('yiting007githubioApp').controller('NavlistCtrl', [
  '$scope',
  'pageCounter',
  function ($scope, pageCounter) {
    var self = this;
    // Put a reference to the controller into $scope so that all the data and methods needed in the
    // scope can go into the controller.
    $scope.navCtrl = self;

    pageCounter.getPageCount(0).success(function (data) {
      console.log(data);
      self.pageCount = data.records;
    }).error(function () {
    });
  }
]);
