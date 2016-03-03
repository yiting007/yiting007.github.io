'use strict';

/*
 * @ngdoc function
 * @name yiting007githubioApp.controller:ideas
 * @description
 * #ideasCtrl
 * Controller of the yiting007githubioApp
 */
angular.module('yiting007githubioApp').controller('ideasCtrl', [
    '$scope',
    'ideaManager',
    function ($scope, ideaManagerService) {
        var DEFAULT = 'walnut007';
        $scope.ideas = {
            access: true 
        };

        // var sampleIdeaObj = {
        //     date: '20160302',
        //     name: 'idea 1',
        //     content: 'this is an awesome idea',
        //     comments: 'no comment',
        //     type: 0
        // };

        var insertIdea = function(ideaObj) {
            ideaManagerService.insertIdea(ideaObj).then(function() {
                loadIdeas();
                $scope.ideas.newIdea = ''; // clear textarea
            }).catch(function(err) {
                console.log('error inserting idea: ', err);
            });
        };

        var loadIdeas = function() {
            ideaManagerService.getIdeas().then(function(data) {
                $scope.ideas.items = data.data;
            }).catch(function(err) {
                console.log('error getting ideas: ', err);
            });
        };

        $scope.insertIdea = function() {
            var d = new Date();
            var ideaObj = {
                date:  d.toDateString(),
                name: 'idea from Yiting',
                content: $scope.ideas.newIdea,
                comments: '',
                type: 0
            };
            insertIdea(ideaObj);
        };

        $scope.getAccess = function() {
            $scope.ideas.access = ($scope.ideas.pwd === DEFAULT);

            if ($scope.ideas.access) {
                loadIdeas();
            }
        };

    }
]);
