'use strict';

/**
 * @ngdoc overview
 * @name yiting007githubioApp
 * @description
 * # yiting007githubioApp
 *
 * Main module of the application.
 */
angular
  .module('yiting007githubioApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'akoenig.deckgrid',
    'dUtilApp',
    'ui.codemirror'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/projects/angular-date-picker', {
        templateUrl: 'views/projects/dateRangePicker.html',
        controller: 'dUtilCtrl',
        controllerAs: 'date-picker'
      })
      .when('/projects/game-of-life', {
        templateUrl: 'views/projects/gameOfLife.html',
        controller: 'lifeCtrl',
        controllerAs: 'game-of-life'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
