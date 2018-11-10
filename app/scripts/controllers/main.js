'use strict';

/**
 * @ngdoc function
 * @name yiting007githubioApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yiting007githubioApp
 */
angular.module('yiting007githubioApp').controller('MainCtrl', [
    '$scope',
    'pageCounter',
    function ($scope, pageCounter) {
        var self = this;
        // Put a reference to the controller into $scope so that all the data and methods needed in the
        // scope can go into the controller.
        $scope.mainCtrl = self;

        pageCounter.getPageCount(0).success(function (data) {
            // console.log(data);
            self.pageCount = data.records;
        }).error(function () {
        });

        self.photos = [{
        // self.photos = [{
        //     id: 'photo-0',
        //     name: 'Dynamic Infinite Scrolling',
        //     src: '/images/scroll.png',
        //     url: '#/projects/infiniteScroll',
            // description: ''
        // },{
            id: 'photo-1',
            name: 'Single Div CSS',
            src: '/images/singleDiv.png',
            url: 'https://github.com/yiting007/singleDiv/blob/master/README.md',
            description: ''
        }, {
            id: 'photo-2',
            name: 'Date Range Picker',
            src: '/images/dateRangePicker.png',
            url: '#/projects/angular-date-picker',
            description: 'An AngularJS directive'
        }, {
            id: 'photo-3',
            name: 'Game of Life',
            src: '/images/gameOfLife.png',
            url: '#/projects/game-of-life',
            description: ''
        }, {
            id: 'photo-4',
            name: 'Java 3D Engine',
            src: '/images/3dEngine.png',
            url: 'https://github.com/yiting007/myJava3D',
            description: ''
        }, {
            id: 'photo-5',
            name: 'Five Chess Game Simulator & AI',
            src: '/images/5ChessGame.png',
            url: 'https://github.com/yiting007/QI_Plantform',
            description: ''
        }, {
            id: 'photo-6',
            name: 'Sudoku Solver',
            src: '/images/sudokuSolver.png',
            url: '#/projects/sudoku',
            description: ''
        }, {
            id: 'photo-7',
            name: 'Golang & Arduino',
            src: '/images/arduinoGo.gif',
            url: '#/projects/arduino',
            description: ''
        }, {
            id: 'photo-8',
            name: 'Digit Recognition',
            src: '/images/digitRec.png',
            url: '#/projects/digit',
            description: ''
        }];
    }
]);
