'use strict';

var app = angular.module('yiting007githubioApp');
app.directive('dropdown', function($document) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            classmenu: '@',
            classlink: '@',
            items: '=',
            initItem: '='
        },
        template: '<span ng-init="isShowMenu = false; currentItem = initItem;">' +
            '<div ng-click="isShowMenu = !isShowMenu" ng-class="classlink" href="javascript:void(0);">' +
            '<div class="d-name">{{ currentItem.name }}</div>' +
            '<div class="d-title">{{ currentItem.title}}</div>' +
            '</div>' +
            '<span ng-show="isShowMenu" ng-click="isShowMenu = false" ng-class="classmenu" ng-style="menuStyle" ng-transclude></span>' +
            '</span>',
        link: function(scope, elm, attrs) {

            scope.menuStyle = { 'position': 'absolute' };

            elm.bind('mousedown', function() {
                // mousedown event is called earlier than click event
                scope.menuStyle['left'] =  elm.prop('offsetLeft') + 'px';
                scope.menuStyle['top'] =  (elm.prop('offsetTop') + elm.prop('offsetHeight')) + 'px';
            });

            elm.bind('click', function(event) {
                event.stopPropagation();
            });

            $document.bind('click', function(e) {
                scope.isShowMenu = false;
                scope.$apply();
            });

            scope.$on('newItem', function(event, params) {
                scope.currentItem = params[0];
            });
        }
    };
});
