"use strict";angular.module("yiting007githubioApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","akoenig.deckgrid","dUtilApp","ui.codemirror","ngFontChart"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).when("/projects/angular-date-picker",{templateUrl:"views/projects/dateRangePicker.html",controller:"dUtilCtrl",controllerAs:"date-picker"}).when("/projects/game-of-life",{templateUrl:"views/projects/gameOfLife.html",controller:"lifeCtrl",controllerAs:"game-of-life"}).when("/projects/arduino",{templateUrl:"views/projects/arduino.html",controller:"arduinoCtrl",controllerAs:"arduino"}).when("/projects/digit",{templateUrl:"views/projects/digit.html",controller:"digitCtrl",controllerAs:"digit"}).when("/projects/sudoku",{templateUrl:"views/projects/sudoku.html",controller:"sudokuCtrl",controllerAs:"sudoku"}).when("/happybirthday",{templateUrl:"views/fun/philBirthday.html",controller:"philBirthdayCtrl",controllerAs:"philBirthday"}).otherwise({redirectTo:"/"})}]),angular.module("yiting007githubioApp").controller("MainCtrl",["$scope",function(a){var b=this;a.mainCtrl=b,b.photos=[{id:"photo-1",name:"Date Range Picker",src:"/images/dateRangePicker.e0c67dbf.png",url:"#/projects/angular-date-picker",description:"An AngularJS directive"},{id:"photo-2",name:"Game of Life",src:"/images/gameOfLife.d15d16e6.png",url:"#/projects/game-of-life",description:""},{id:"photo-3",name:"Java 3D Engine",src:"/images/3dEngine.b69870fc.png",url:"https://github.com/yiting007/myJava3D",description:""},{id:"photo-4",name:"Five Chess Game Simulator & AI",src:"/images/5ChessGame.23a0a800.png",url:"https://github.com/yiting007/QI_Plantform",description:""},{id:"photo-5",name:"Sudoku Solver",src:"/images/sudokuSolver.1e4c896e.png",url:"#/projects/sudoku",description:""},{id:"photo-6",name:"Golang & Arduino",src:"/images/arduinoGo.2b2489f6.gif",url:"#/projects/arduino",description:""},{id:"photo-7",name:"Digit Recognition",src:"/images/digitRec.eda0a436.png",url:"#/projects/digit",description:""}]}]),angular.module("yiting007githubioApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("yiting007githubioApp").controller("dUtilCtrl",["$scope","$filter",function(a,b){a.calNum=3,a.dateFormat="YYYY-MM-DD",a.test=function(){a.hi=!a.hi},a.testClick1=function(){var c=new Date(a.datePicker.fromDate);c.setDate(c.getDate()),a.datePicker.fromDate=b("date")(c,"yyyy-MM-dd")};var c=1;a.testClick2=function(){var b=[{name:"Custom ranges",v:"-1"},{name:"Today",v:"0"},{name:"Yesterday",v:"1"},{name:"Last Week",v:"7"},{name:"Last Month",v:"28"},{name:"Last 3 Months",v:"91"},{name:"Last 12 Months",v:"364"}];a.datePicker.range=b[c],c=c%6+1},a.editorOptionsJs={mode:"javascript",lineNumbers:!0,readOnly:"true"},a.editorOptionsHtml={mode:"xml",lineNumbers:!0,readOnly:"true"},a.htmlCode='<date-picker ng-model="datePicker" calendar-num="calNum" format="dateFormat" ng-change="test()">\n<button ng-model="testBtn1" ng-click="testClick1()">change fromDate</button>\n<button ng-model="testBtn2" ng-click="testClick2()">chage date range</button>\n<pre># of months: {{ calNum }} </pre>\n<pre>format: {{ dateFormat }}</pre>\n<pre>datePicker.range: {{ datePicker.range }}</pre>\n<pre>datePicker.fromDate: {{datePicker.fromDate}} </pre>\n<pre>datePicker.toDate: {{ datePicker.toDate }}</pre>\n<pre>datePicker.displayDate: {{ datePicker.displayDate}}</pre>',a.jsCode="$scope.calNum = 4;\n$scope.dateFormat = 'YYYY-MM-DD';\n\n$scope.test = function() {\n  $scope.hi = !$scope.hi;\n};\n\n$scope.testClick1 = function() {\n  var current = new Date($scope.datePicker.fromDate);\n  current.setDate(current.getDate());\n  $scope.datePicker.fromDate = $filter('date')(current, 'yyyy-MM-dd');\n};\n\nvar i = 1;\n$scope.testClick2 = function() {\n  var ranges = [{\n  name: 'Custom ranges',\n  v: '-1'\n  }, {\n  name: 'Today',\n  v: '0'\n  }, {\n  name: 'Yesterday',\n  v: '1'\n  }, {\n  name: 'Last Week',\n  v: '7'\n  }, {\n  name: 'Last Month',\n  v: '28'\n  }, {\n  name: 'Last 3 Months',\n  v: '91'\n  }, {\n  name: 'Last 12 Months',\n  v: '364'\n  }];\n  $scope.datePicker.range = ranges[i];\n  i = i% 6 + 1;\n};"}]),angular.module("yiting007githubioApp").controller("lifeCtrl",["$scope",function(a){function b(a){this.canvas=document.getElementById("b"),this.context=this.canvas.getContext("2d"),this.element={},this.activeCells={},this.canvas.width=a.width,this.canvas.height=a.height,this.element.size=a.cellSize,this.element.offset=a.offset,this.generationCounter=0,this.liveCellsCounter=0}function c(a){var b=f.getRelativePisition(a);f.updateMousePosition(b)}function d(a){var b=f.getRelativePisition(a);f.manageActiveCell(b,!0),document.getElementById("liveCnt").innerHTML=f.liveCellsCounter}function e(){document.getElementById("generationCnt").innerHTML=f.generationCounter,document.getElementById("liveCnt").innerHTML=f.liveCellsCounter}b.prototype.initWorld=function(){this.context.clearRect(this.element.offset,this.element.offset,this.canvas.width,this.canvas.height),this.activeCells={},this.generationCounter=0,this.liveCellsCounter=0;for(var a=this.element.offset;a<this.canvas.width;a+=this.element.size)this.context.moveTo(a,0),this.context.lineTo(a,this.canvas.height);for(var b=this.element.offset;b<this.canvas.height;b+=this.element.size)this.context.moveTo(0,b),this.context.lineTo(this.canvas.width,b);this.context.strokeStyle="#eee",this.context.stroke(),this.updateMousePosition(null)},b.prototype.updateMousePosition=function(a){var b={};b.height=15,b.width=60,b.x=this.canvas.width-b.width,b.y=this.canvas.height-b.height,this.context.clearRect(b.x,b.y,b.width,b.height),null===a?b.val="(0, 0)":b.val="("+a.x+", "+a.y+")",this.context.textBaselin="top",this.context.fillText(b.val,b.x,this.canvas.height-3)},b.prototype.getRelativePisition=function(a){var b={},c=this.canvas.getBoundingClientRect();b.x=a.clientX-c.left,b.y=a.clientY-c.top,b.x-=this.element.offset,b.y-=this.element.offset;var d=b.x,e=b.y;return b.x=Math.floor(e/this.element.size),b.y=Math.floor(d/this.element.size),b},b.prototype.manageActiveCell=function(a,b){for(var c=-1;1>=c;c++)for(var d=-1;1>=d;d++)(0!==c||0!==d)&&this.addCellHelper(JSON.stringify({x:a.x+c,y:a.y+d}),!1);var e=JSON.stringify(a);e in this.activeCells&&this.activeCells[e]||(this.addCellHelper(JSON.stringify(a),!0),this.drawCellHelper(a),b&&this.liveCellsCounter++)},b.prototype.addCellHelper=function(a,b){b?this.activeCells[a]=b:a in this.activeCells||(this.activeCells[a]=b)},b.prototype.checkCellHelper=function(a){return a in this.activeCells&&this.activeCells[a]?!0:!1},b.prototype.drawCellHelper=function(a){this.context.fillRect(a.y*this.element.size,a.x*this.element.size,this.element.size,this.element.size)},b.prototype.clearCellHelper=function(a){var b=.1;this.context.clearRect(a.y*this.element.size+b,a.x*this.element.size+b,this.element.size-b,this.element.size-b)},b.prototype.hasLiveCells=function(){if(0===Object.keys(this.activeCells).length)return!1;for(var a in this.activeCells)if(this.activeCells.hasOwnProperty(a)&&this.activeCells[a])return!0;return!1},b.prototype.nextGeneration=function(){this.generationCounter++;var a=[],b=[],c=0;for(var d in this.activeCells){var e=0,f=JSON.parse(d);for(c=-1;1>=c;c++)for(var g=-1;1>=g;g++)if(0!==c||0!==g){var h=JSON.stringify({x:f.x+c,y:f.y+g});this.checkCellHelper(h)&&(e+=1)}this.activeCells[d]&&2>e?(b.push(d),this.liveCellsCounter--):!this.activeCells[d]||2!==e&&3!==e?this.activeCells[d]&&e>3?(b.push(d),this.liveCellsCounter--):this.activeCells[d]||3!==e||(a.push(d),this.liveCellsCounter++):a.push(d)}for(c=0;c<a.length;c++)this.manageActiveCell(JSON.parse(a[c]),!1);for(c=0;c<b.length;c++)this.activeCells[b[c]]=!1,this.clearCellHelper(JSON.parse(b[c]))};var f,g,h={width:900,height:700,cellSize:10,offset:0};f=new b(h),f.initWorld(),f.canvas.addEventListener("mousemove",c,!1),f.canvas.addEventListener("click",d,!1),a.btnNext=function(){f.hasLiveCells()&&(f.nextGeneration(),e())},a.btnClear=function(){f.initWorld(),clearInterval(g),e()},a.btnAutoRun=function(){g=setInterval(function(){f.hasLiveCells()||clearInterval(this),f.nextGeneration(),e()},100)},a.btnStop=function(){clearInterval(g)}}]),angular.module("yiting007githubioApp").controller("arduinoCtrl",["$scope",function(a){a.editorOptionsGo={mode:"go",lineNumbers:!0,readOnly:"true"},a.goCode='package main\n\nimport (\n    "fmt"\n    "time"\n    "github.com/hybridgroup/gobot"\n    "github.com/hybridgroup/gobot/platforms/firmata"\n    "github.com/hybridgroup/gobot/platforms/gpio"\n)\n\nfunc main() {\n    gbot := gobot.NewGobot()\n\n    firmataAdaptor := firmata.NewFirmataAdaptor("firmata", "/dev/tty.usbmodem1411")\n    servo := gpio.NewServoDriver(firmataAdaptor, "servo", "7")\n\n    work := func() {\n        gobot.Every(500*time.Millisecond, func() {\n            i := uint8(gobot.Rand(100) + 50)\n            fmt.Println("Turning", i)\n            servo.Move(i)\n        })\n    }\n    robot := gobot.NewRobot("servoBot",\n        []gobot.Connection{firmataAdaptor},\n        []gobot.Device{servo},\n        work,\n    )\n    gbot.AddRobot(robot)\n    gbot.Start()\n}'}]),angular.module("yiting007githubioApp").controller("sudokuCtrl",function(){}),angular.module("yiting007githubioApp").controller("digitCtrl",function(){}),angular.module("yiting007githubioApp").controller("philBirthdayCtrl",["$scope","$timeout",function(a,b){a.getRandomValue=function(c,d){var e=c,f=d;b(function(){a.themes[e].charts[f].value=Math.floor(100*Math.random()),a.getRandomValue(e,f)},4e3)},a.themes=[{title:"Happy",charts:[{font:"fa-heart",value:a.getRandomValue(0,0),startColor:"#3b5998"},{font:"fa-car",value:a.getRandomValue(0,1),startColor:"#00abed"},{font:"fa-battery-empty",value:a.getRandomValue(0,2),startColor:"#d1002d"},{font:"fa-compass",value:a.getRandomValue(0,3),startColor:"#0274b3"},{font:"fa-reply",value:a.getRandomValue(0,4),startColor:"#ca2128"}]},{title:"Birthday",charts:[{font:"fa-beer",value:a.getRandomValue(1,0),startColor:"#0d780d"},{font:"fa-circle-o",value:a.getRandomValue(1,1),startColor:"#2e599d"},{font:"fa-cart-plus",value:a.getRandomValue(1,2),startColor:"#bb0706"},{font:"fa-gift",value:a.getRandomValue(1,3),startColor:"#d56703"},{font:"fa-pie-chart",value:a.getRandomValue(1,4),startColor:"#0b0b0b"},{font:"fa-calendar",value:a.getRandomValue(1,5),startColor:"#0b0b0b"},{font:"fa-download",value:a.getRandomValue(1,6),startColor:"#0b0b0b"},{font:"fa-birthday-cake",value:a.getRandomValue(1,7),startColor:"#0b0b0b"}]}]}]),angular.module("yiting007githubioApp").directive("background",["$timeout",function(a){return function(b,c){var d=["#d35400","#2c3e50","#1abc9c","#2980b9","#7f8c8d","#f1c40f","#d35400","#27ae60"];b.updateBackgroud=function(){a(function(){c.css("background",d[Math.floor(8*Math.random())]),b.updateBackgroud()},4e3)},b.updateBackgroud()}}]),angular.module("yiting007githubioApp").run(["$templateCache",function(a){a.put("views/about.html",'<div class="content-main"> <div class="resume-wrapper"> <img src="/images/resume.f6568198.png"> </div> </div>'),a.put("views/cardTemplate.html",'<div class="a-card"> <a href="{{card.url}}"> <div class="card-photo-wapper"> <img src="" data-ng-src="{{card.src}}"> </div> <div class="card-description"> <h3>{{card.name}}</h3> {{card.description}} </div> </a> </div>'),a.put("views/fun/philBirthday.html",'<div class="content-main"> <h2>Hello Phil,</h2> </div> <div class="theme" ng-repeat="theme in themes"> <ng-font-chart ng-repeat="chart in theme.charts" font="fa {{chart.font}}" value="chart.value" start-color="{{chart.startColor}}" end-color="rgba(255,255,255, 0.8)" class="metrics"> </ng-font-chart> </div> <div class="footer"> --- from Yiting </div>'),a.put("views/main.html",'<div ng-include src="\'views/navlist.html\'"></div> <div class="content-main"> <div deckgrid class="deckgrid" source="mainCtrl.photos" cardtemplate="/views/cardTemplate.html"></div> </div>'),a.put("views/navlist.html",'<div class="blog-title-wapper"> <a href="#/"> <i class="fa fa-smile-o fa-inverse"></i> <span class="blog-title-name">Yiting\'s Blog</span> </a> </div> <div class="navbarIcons"> <a href="#/"><i class="fa fa-home fa-fw fa-2x"></i></a> <a href="https://github.com/yiting007" target="_blank"><i class="fa fa-github-square fa-fw fa-2x"></i></a> <a href="https://www.linkedin.com/pub/yiting-li/59/319/910" target="_blank"><i class="fa fa-linkedin fa-fw fa-2x"></i></a> <a href="https://www.facebook.com/yiting.li.9849" target="_blank"><i class="fa fa-facebook-square fa-fw fa-2x"></i></a> <a href="mailto:yiting.star@gmail.com"><i class="fa fa-envelope-square fa-fw fa-2x"></i></a> <a href="#/about"><i class="fa fa-file-text-o fa-fw fa-2x"></i></a> </div>'),a.put("views/projects/3dEngine.html",""),a.put("views/projects/5Chess.html",""),a.put("views/projects/arduino.html",'<div class="content-arduino"> <h3>Play with Arduino UNO using Golang (and Lego!) <a href="https://github.com/yiting007/goard" target="_blank"> <i class="fa fa-code-fork fa-fw"></i></a> </h3> <h4>Requirements</h4> <ul> <li>Having Golang installed and GOPATH set;</li> <li>Having an arduino UNO with some other components;</li> <li>It will be more fun if you also have some Lego parts.</li> </ul> <ol> <li>Install <a class="arduino-link" href="http://brew.sh/" target="_blank">Homebrew</a></li> Because I\'m using Mac, and Gort for Mac uses Homebrew. <li>Install <a class="arduino-link" href="http://gort.io/" target="_blank">Gort</a>, then</li> <pre class="arduino-code">$ ./gort scan serial</pre> <pre class="arduino-code">$ ./gort arduino install</pre> <pre class="arduino-code">$ ./gort arduino upload firmate [serial]</pre> <li>Install <a class="arduino-link" href="https://github.com/tarm/goserial" target="_blank">tarm/goerial</a></li> It has been replaced by tarm/serial but Gobot still uses the old one. <pre class="arduino-code">$ go get github.com/tarm/goserial</pre> <li>Install <a class="arduino-link" href="http://gobot.io/documentation/platforms/arduino/" target="_blank">Gobot for arduino</a></li> Then you should be able to run the examples using Gobot! </ol> <h4>A servo example</h4> <div class="dp-info-codeblock"> <div class="dp-info-codename">servo.go</div> <ui-codemirror ui-codemirror-opts="editorOptionsGo" ng-model="goCode"></ui-codemirror> </div> <img class="arduino-right-pic" src="/images/arduinoGo.2b2489f6.gif"> <img class="arduino-left-pic" src="/images/arduinoRun.cdd4c83f.png"> </div>'),a.put("views/projects/dateRangePicker.html",'<div class="content-dateRangePicker"> <h3>Simple date range picker in AngularJS, with no JQuery or Bootstrap and simple css <a href="https://github.com/yiting007/angular-dUtil" target="_blank"> <i class="fa fa-code-fork fa-fw"></i></a> </h3> <div class="dp-demo-wrapper"> <div class="dp-info"> <button ng-model="testBtn1" ng-click="testClick1()" class="pure-button">change fromDate</button> <button ng-model="testBtn2" ng-click="testClick2()" class="pure-button">chage date range</button> <pre># of months: {{ calNum }} </pre> <pre>format: {{ dateFormat }}</pre> <pre>datePicker.range: {{ datePicker.range }}</pre> <pre>datePicker.fromDate: {{datePicker.fromDate}} </pre> <pre>datePicker.toDate: {{ datePicker.toDate }}</pre> <pre>datePicker.displayDate: {{ datePicker.displayDate}}</pre> </div> <div class="dp-demo"> <date-picker ng-model="datePicker" calendar-num="calNum" format="dateFormat" ng-change="test()"> </div> <i class="fa fa-arrow-up fa-fw fa-4x"></i> <h1>click here</h1> </div> <div class="dp-info-wrapper"> <h3>How to install</h3> <pre>bower install yiting007/angular-dUtil --save</pre> <span>This will copy the source code files into your bower_components folder, along with its dependencies. Next add the script file into your application.<span> <pre>&lt;<font color="green">script</font> <font color="brown">src</font>="<font color="blue">bower_components/angular-dUtil/dUtil.js</font>"&gt;&lt;/<font color="green">script</font>&gt;</pre> <span>The css file directory is</span> <pre><font color="blue">bower_components/angular-dUtil/dUtil.css</font></pre> <span>Modify this file if needed then add it into your application too.</span> </span></span></div> <div class="dp-info-wrapper"> <h3>How to use</h3> <span>Add the \'dUtilApp\' module as a dependency to your application module.</span> <pre><font color="purple">var</font> myAppModule = angular.module(\'<font color="blue">MyApp</font>\', [\'<font color="blue">dUtilApp</font>\']);</pre> </div> <div class="dp-info-wrapper"> <h3> Code for the demo above</h3> <div class="dp-info-codeblock"> <div class="dp-info-codename">example.js</div> <ui-codemirror ui-codemirror-opts="editorOptionsJs" ng-model="jsCode"></ui-codemirror> </div> <div class="dp-info-codeblock"> <div class="dp-info-codename">example.html</div> <ui-codemirror ui-codemirror-opts="editorOptionsHtml" ng-model="htmlCode"></ui-codemirror> </div> </div> </div>'),a.put("views/projects/digit.html",'<div class="content-main"> Coming soon </div>'),a.put("views/projects/gameOfLife.html",'<div class="content-gameOfLife"> <div> <h3>A Javascript implementation of Conway\'s Game of Life <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank"> <i class="fa fa-question-circle fa-fw"></i></a> <a href="https://github.com/yiting007/game-of-life" target="_blank"> <i class="fa fa-code-fork fa-fw"></i></a> </h3> <ol> <li>Any live cell with fewer than two live neighbours dies, as if caused by under-population.</li> <li>Any live cell with two or three live neighbours lives on to the next generation.</li> <li>Any live cell with more than three live neighbours dies, as if by overcrowding.</li> <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li> </ol> </div> <div class="life-info-wrapper"> <ul> <li>#of live cells: <span id="liveCnt"></span> </li> <li>#of generations: <span id="generationCnt"></span> </li> </ul> <div> <button id="btnNext" ng-click="btnNext()" class="life-button">next</button> <button id="btnClear" ng-click="btnClear()" class="life-button">clear</button> <button id="btnAutoRun" ng-click="btnAutoRun()" class="life-button">auto</button> <button id="btnStop" ng-click="btnStop()" class="life-button">stop</button> </div> </div> <div class="life-demo-wrapper"> <canvas class="c" id="b" style="border-style: solid; border-width: 1px"></canvas> </div> </div>'),a.put("views/projects/sudoku.html",'<div class="content-main"> Coming soon </div>')}]);