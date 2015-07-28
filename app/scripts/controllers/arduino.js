'use strict';

/*
 * @ngdoc function
 * @name yiting007githubioApp.controller:arduinoCtrl
 * @description
 * # arduinoCtrl
 * Controller of the yiting007githubioApp
 */
angular.module('yiting007githubioApp').controller('arduinoCtrl', [
  '$scope',
  'pageCounter',
  function ($scope, pageCounter) {

    pageCounter.getPageCount(5).success(function (data) {
      console.log(data);
      $scope.pageCount = data.records;
    }).error(function () {});


    $scope.editorOptionsGo = {
      mode: 'go',
      lineNumbers: true,
      readOnly: 'true',
    };

    $scope.goCode = '' +
      'package main\n\n' +

      'import (\n' +
      '    "fmt"\n' +
      '    "time"\n' +
      '    "github.com/hybridgroup/gobot"\n' +
      '    "github.com/hybridgroup/gobot/platforms/firmata"\n' +
      '    "github.com/hybridgroup/gobot/platforms/gpio"\n' +
      ')\n\n' +

      'func main() {\n' +
      '    gbot := gobot.NewGobot()\n\n' +

      '    firmataAdaptor := firmata.NewFirmataAdaptor("firmata", "/dev/tty.usbmodem1411")\n' +
      '    servo := gpio.NewServoDriver(firmataAdaptor, "servo", "7")\n\n' +

      '    work := func() {\n' +
      '        gobot.Every(500*time.Millisecond, func() {\n' +
      '            i := uint8(gobot.Rand(100) + 50)\n' +
      '            fmt.Println("Turning", i)\n' +
      '            servo.Move(i)\n' +
      '        })\n' +
      '    }\n' +
      '    robot := gobot.NewRobot("servoBot",\n' +
      '        []gobot.Connection{firmataAdaptor},\n' +
      '        []gobot.Device{servo},\n' +
      '        work,\n' +
      '    )\n' +
      '    gbot.AddRobot(robot)\n' +
      '    gbot.Start()\n' +
      '}';

  }
]);
