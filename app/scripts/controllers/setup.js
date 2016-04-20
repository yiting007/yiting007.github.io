'use strict';

/*
 * @ngdoc function
 * @name yiting007githubioApp.controller:digitCtrl
 * @description
 * # setupCtrl
 * Controller of the yiting007githubioApp
 */
angular.module('yiting007githubioApp').controller('setupCtrl', [
    '$scope',
    function ($scope) {
        $scope.buildControl = '' +
            '// grunt-build-control\n' +
            'buildcontrol: {\n' +
            '  options: {\n' +
            '    dir: \'dist\',\n' +
            '    commit: true,\n' +
            '    push: true,\n' +
            '    message: \'Build %sourceName% from commit %sourceCommit% on branch %sourceBranch%\'\n' +
            '  },\n' +
            '  pages: {\n' +
            '    remote: \'git@github.com:username/username.github.io.git\',\n' +
            '    branch: \'master\'\n' +
            '  },\n' +
            '  local: {\n' +
            '    options: {\n' +
            '      remote: \'../\',\n' +
            '      branch: \'build\'\n' +
            '    }\n' +
            '  }\n';

        $scope.deployTask = '' +
            'grunt.registerTask(\'deploy\', [\n' +
              '\'buildcontrol:pages\'\n' +
            ']);';

        $scope.codeMirrorOptions = {
            mode: 'javascript',
            lineNumbers: true,
            readOnly: 'true',
        };


    }
]);
