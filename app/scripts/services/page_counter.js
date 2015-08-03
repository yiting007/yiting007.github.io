'use strict';

angular.module('yiting007githubioApp').service('pageCounter', [
  '$http',
  function ($http) {
    var counterRequestURL = 'https://io-backend.herokuapp.com/count';
    this.getPageCount = function (pageId) {
      return $http({
        method: 'POST',
        url: counterRequestURL,
        headers: {'Content-Type': 'application/json'},
        data: {
          'pageId': pageId
        }
      });
    };
  }
]);
