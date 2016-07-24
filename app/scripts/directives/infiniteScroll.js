'use strict';

var app = angular.module('yiting007githubioApp');
app.directive('infiniteScroll', function($window) {
    return {
        restrict: 'EAC',
        scope: true,
        templateUrl: '/views/templates/infiniteScroll.html',
        link: function(scope, elm, attr) {
            scope.contentQueue = [];
            scope.infoObj = {};
            scope.triggerList = [];

            var _count = 0;
            var init = function() {
                updateList();
            };

            var updateList = function(tag) {
                if (!tag) {
                    tag = 'transparent';
                }
                for (var i = 0; i < 5; i++) {
                    scope.contentQueue.push({
                        num: ++_count,
                        tag: tag
                    });
                }
            };

            var updateInfo = function(raw) {
                scope.infoObj.pageYOffset = $window.pageYOffset;
                scope.infoObj.innerHeight = $window.innerHeight;
                scope.infoObj.offsetHeight = raw.offsetHeight;
                scope.$apply(scope.infoObj);
            };
            var raw = elm[0];

            console.log(raw);
            angular.element($window).bind("scroll", function() {
                updateInfo(raw);
                if ($window.pageYOffset + $window.innerHeight > raw.offsetHeight) {
                    scope.triggerList.push($window.pageYOffset);
                    updateList();
                }
            });

            init();
        }
    };
});
