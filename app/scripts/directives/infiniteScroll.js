'use strict';

var app = angular.module('yiting007githubioApp');
app.directive('infiniteScroll', function($window, $timeout) {
    return {
        restrict: 'EAC',
        scope: true,
        templateUrl: '/views/templates/infiniteScroll.html',
        link: function(scope, elm) {
            scope.sections = [];
            scope.infoObj = {};
            scope.triggerList = [];

            var _count = 0;
            var _range = 3;
            var _defaultRecordNum = 5;
            var _height = 200;
            var _stackTop = [];
            var _stackBottom = [];
            var _triggeredPoints = [];
            var _loading = false;

            var _printNum = function(name, sections) {
                var res = '';
                for (var i = 0; i < sections.length; i++) {
                    var sec = sections[i].records;
                    var nums = '';
                    for (var j = 0; j < sec.length; j++) {
                        nums += sec[j].num;
                        nums += (j === sec.length - 1) ? '\n' : ',';
                    }
                    res += nums;
                }
                scope.infoObj[name] = res;
            };

            var debugOutput = function(sections) {
                _printNum('stackTop', _stackTop);
                _printNum('sections', sections);
                _printNum('stackBottom', _stackBottom);
            };

            var updateList = function(records, sections, reset, currentHeight) {
                _loading = true;
                if (reset) {
                    sections.length = 0;
                    _stackTop.length = 0;
                    _stackBottom.length = 0;
                    _triggeredPoints.length = 0;
                }
                var resetScrollTop = true;
                sections.push({
                    height: _height * records.length,
                    records: records
                });
                // remove the first section
                if (sections.length > _range) {
                    _stackTop.push(sections.shift());
                } else {
                    resetScrollTop = false;
                    _triggeredPoints.push(currentHeight === undefined ? 1 : currentHeight);
                }
                $timeout(function() {
                    _loading = false;
                }, 10);
                return resetScrollTop;
            };

            var checkUpdates = function(currentHeight, sections) {
                var len = _triggeredPoints.length;
                var internalObj = null;
                if (len > 1 && currentHeight < _triggeredPoints[1] && _stackTop.length) { // scroll up to the first section
                    sections.unshift(_stackTop.pop());
                    _stackBottom.unshift(sections.pop());
                    internalObj = {
                        direction: 1,
                        height: sections[0].records.length * _height,
                        showGoUpButton: _stackTop.length !== 0
                    };
                } else if (currentHeight > _triggeredPoints[len - 1] && _stackBottom.length) { // scroll down to the last section
                    sections.push(_stackBottom.shift());
                    _stackTop.push(sections.shift());
                    internalObj = {
                        direction: -1,
                        height: sections[sections.length - 1].records.length * _height,
                        showGoUpButton: _stackTop.length !== 0
                    };
                } else if (currentHeight >= _triggeredPoints[len - 1]) { // need to load more tickets via GET request
                    internalObj = {
                        direction: -1,
                        height: 0,
                        showGoUpButton: _stackTop.length !== 0,
                        defaultHeight:  _defaultRecordNum * _height
                    };
                }
                return internalObj;
            };

            var loadNewRecords = function() {
                var newRecords = [];
                for (var i = 0; i < _defaultRecordNum; i++) {
                    newRecords.push({
                        num: ++_count,
                        height: _height + 'px'
                    });
                }
                return newRecords;
            };

            var scrollAction = function() {
                var raw = elm[0];
                var currentScrollY = $window.pageYOffset;
                var internalUpdates = checkUpdates(currentScrollY, scope.sections);
                if (internalUpdates === null) {
                    return;
                }
                if (internalUpdates.height !== 0) { // internal update done
                    document.body.scrollTop = document.body.scrollTop + internalUpdates.height * internalUpdates.direction;
                    debugOutput(scope.sections);
                    return scope.$apply();
                } else { // need to load more tickets
                    if ((currentScrollY + $window.innerHeight >= raw.offsetHeight) && !_loading) { // scroll down
                        var moreRecords = loadNewRecords();
                        updateList(moreRecords, scope.sections, false, currentScrollY);
                        document.body.scrollTop = document.body.scrollTop - internalUpdates.defaultHeight;
                        debugOutput(scope.sections);
                    }
                }
            };

            var init = function() {
                var newRecords = loadNewRecords();
                updateList(newRecords, scope.sections, false);
            };

            angular.element($window).bind("scroll", function() {
                scrollAction();
            });

            init();
        }
    };
});
