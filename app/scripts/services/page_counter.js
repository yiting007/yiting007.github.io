'use strict';

angular.module('yiting007githubioApp').service('pageCounter', [
  '$http',
  function ($http) {
    var counterRequestURL = 'https://hidden-retreat-5902.herokuapp.com/count';
    this.getPageCount = function (pageId) {
      return $http({
        method: 'GET',
        url: counterRequestURL,
        dataType: 'jsonp',
        params: {
          'pageId': pageId
        }
      });
    };
  }
]);
