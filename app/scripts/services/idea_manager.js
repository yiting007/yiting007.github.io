'use strict';

angular.module('yiting007githubioApp').service('ideaManager', [
    '$http',
    function ($http) {
        var ideasRequestURL = 'https://io-backend.herokuapp.com/ideas';

        this.insertIdea = function (ideaObj) {
            return $http({
                method: 'POST',
                url: ideasRequestURL,
                headers: {'Content-Type': 'application/json'},
                data: {
                    'date': ideaObj.date,
                    'name': ideaObj.name,
                    'content': ideaObj.content,
                    'comments': ideaObj.comments,
                    'type': ideaObj.type
                }
            });
        };

        this.getIdeas = function () {
            return $http({
                method: 'GET',
                url: ideasRequestURL,
                headers: {'Content-Type': 'application/json'}
            });
        };
    }
]);
