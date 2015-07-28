'use strict';

/*
 * @ngdoc function
 * @name yiting007githubioApp.controller:dUtilCtrl
 * @description
 * # dUtilCtrl
 * Controller of the yiting007githubioApp
 */
angular.module('yiting007githubioApp').controller('dUtilCtrl', [
  '$scope',
  '$filter',
  'pageCounter',
  function ($scope, $filter, pageCounter) {
    $scope.calNum = 3;
    $scope.dateFormat = 'YYYY-MM-DD';

    pageCounter.getPageCount(1).success(function (data) {
      console.log(data);
      $scope.pageCount = data.records;
    }).error(function () {
    });

    $scope.test = function () {
      $scope.hi = !$scope.hi;
    };

    $scope.testClick1 = function () {
      var current = new Date($scope.datePicker.fromDate);
      current.setDate(current.getDate()); //so wired...
      $scope.datePicker.fromDate = $filter('date')(current, 'yyyy-MM-dd');
    };

    var i = 1;
    $scope.testClick2 = function () {
      var ranges = [{
        name: 'Custom ranges',
        v: '-1'
      }, {
        name: 'Today',
        v: '0'
      }, {
        name: 'Yesterday',
        v: '1'
      }, {
        name: 'Last Week',
        v: '7'
      }, {
        name: 'Last Month',
        v: '28'
      }, {
        name: 'Last 3 Months',
        v: '91'
      }, {
        name: 'Last 12 Months',
        v: '364'
      }];
      $scope.datePicker.range = ranges[i];
      i = i % 6 + 1;
    };

    $scope.editorOptionsJs = {
      mode: 'javascript',
      lineNumbers: true,
      readOnly: 'true',
    };

    $scope.editorOptionsHtml = {
      mode: 'xml',
      lineNumbers: true,
      readOnly: 'true',
    };


    $scope.htmlCode = '' +
      '<date-picker ng-model="datePicker" calendar-num="calNum" format="dateFormat" ng-change="test()">\n' +
      '<button ng-model="testBtn1" ng-click="testClick1()">change fromDate</button>\n' +
      '<button ng-model="testBtn2" ng-click="testClick2()">chage date range</button>\n' +
      '<pre># of months: {{ calNum }} </pre>\n' +
      '<pre>format: {{ dateFormat }}</pre>\n' +
      '<pre>datePicker.range: {{ datePicker.range }}</pre>\n' +
      '<pre>datePicker.fromDate: {{datePicker.fromDate}} </pre>\n' +
      '<pre>datePicker.toDate: {{ datePicker.toDate }}</pre>\n' +
      '<pre>datePicker.displayDate: {{ datePicker.displayDate}}</pre>';

    $scope.jsCode = '' +
      '$scope.calNum = 4;\n' +
      '$scope.dateFormat = \'YYYY-MM-DD\';\n\n' +
      '$scope.test = function() {\n' +
      '  $scope.hi = !$scope.hi;\n' +
      '};\n\n' +
      '$scope.testClick1 = function() {\n' +
      '  var current = new Date($scope.datePicker.fromDate);\n' +
      '  current.setDate(current.getDate());\n' +
      '  $scope.datePicker.fromDate = $filter(\'date\')(current, \'yyyy-MM-dd\');\n' +
      '};\n\n' +
      'var i = 1;\n' +
      '$scope.testClick2 = function() {\n' +
      '  var ranges = [{\n' +
      '  name: \'Custom ranges\',\n' +
      '  v: \'-1\'\n' +
      '  }, {\n' +
      '  name: \'Today\',\n' +
      '  v: \'0\'\n' +
      '  }, {\n' +
      '  name: \'Yesterday\',\n' +
      '  v: \'1\'\n' +
      '  }, {\n' +
      '  name: \'Last Week\',\n' +
      '  v: \'7\'\n' +
      '  }, {\n' +
      '  name: \'Last Month\',\n' +
      '  v: \'28\'\n' +
      '  }, {\n' +
      '  name: \'Last 3 Months\',\n' +
      '  v: \'91\'\n' +
      '  }, {\n' +
      '  name: \'Last 12 Months\',\n' +
      '  v: \'364\'\n' +
      '  }];\n' +
      '  $scope.datePicker.range = ranges[i];\n' +
      '  i = i% 6 + 1;\n' +
      '};';

  }
]);
