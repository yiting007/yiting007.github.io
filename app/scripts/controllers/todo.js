'use strict';

/*
 * @ngdoc function
 * @name yiting007githubioApp.controller:digitCtrl
 * @description
 * # todoCtrl
 * Controller of the yiting007githubioApp
 */
angular.module('yiting007githubioApp').controller('todoCtrl', [
    '$scope',
    function ($scope) {

        $scope.todoList = [];

        $scope.addItem = function() {
            if (!$scope.listItem) {
                return;
            }
            $scope.todoList.push({
                title: $scope.listItem,
                done: false,
                checked: false,
                removed: false
            });
            $scope.listItem = '';
        };

        $scope.markAsDone = function() {
            for (var i = 0; i < $scope.todoList.length; i++) {
                if ($scope.todoList[i].checked) {
                    $scope.todoList[i].done = true;
                }
            }
        };

        $scope.removeDone = function() {
            for (var i = 0; i < $scope.todoList.length; i++) {
                if ($scope.todoList[i].done) {
                    $scope.todoList[i].removed= true;
                }
            }
        };
    }
]);
