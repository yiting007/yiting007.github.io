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
      .when('/projects/arduino', {
        templateUrl: 'views/projects/arduino.html',
        controller: 'arduinoCtrl',
        controllerAs: 'arduino'
      })
      .when('/projects/digit', {
        templateUrl: 'views/projects/digit.html',
        controller: 'digitCtrl',
        controllerAs: 'digit'
      })
      .when('/projects/sudoku', {
        templateUrl: 'views/projects/sudoku.html',
        controller: 'sudokuCtrl',
        controllerAs: 'sudoku'
      })
      .when('/happybirthday', {
        templateUrl: 'views/fun/philBirthday.html',
        controller: 'philBirthdayCtrl',
        controllerAs: 'philBirthday'
      })
      .when('/ideas', {
          templateUrl: 'views/fun/ideas.html',
          controller: 'ideasCtrl',
          controllerAs: 'ideas'
      })
      .when('/todo', {
          templateUrl: 'views/fun/todo.html',
          controller: 'todoCtrl',
          controllerAs: 'todo'
      })
      .when('/notes/io-setup', {
          templateUrl: 'views/notes/io-setup.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
