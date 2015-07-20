'use strict';

/**
 * @ngdoc function
 * @name yiting007githubioApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yiting007githubioApp
 */
angular.module('yiting007githubioApp')
  .controller('MainCtrl', function ($scope) {
    var self = this;
    // Put a reference to the controller into $scope so that all the data and methods needed in the
    // scope can go into the controller.
    $scope.mainCtrl = self;

    self.photos = [{
      id: 'photo-1',
      name: 'Date Range Picker',
      src: '/images/dateRangePicker.png'
    }, {
      id: 'photo-2',
      name: 'Game of Life',
      src: '/images/gameOfLife.png'
    }, {
      id: 'photo-3',
      name: 'Java 3D Engine',
      src: '/images/3dEngine.png'
    }, {
      id: 'photo-4',
      name: 'Five Chess Game Simulator & AI',
      src: '/images/5ChessGame.png'
    }, {
      id: 'photo-5',
      name: 'Sudoku Solver',
      src: '/images/sudokuSolver.png'
    }, {
      id: 'photo-6',
      name: 'Golang & Arduino',
      src: '/images/arduinoGo.gif'
    }, {
      id: 'photo-7',
      name: 'Digit Recognition',
      src: '/images/digitRec.png'
    }];
  });
