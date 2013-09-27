/*global define*/
'use strict';

define(['app', 'fakeMessages'], function (app, fakeMessages) {
    return app.controller('DetailController', ['$scope', '$routeParams',
        function DetailController($scope, $routeParams) {
            $scope.message = fakeMessages[$routeParams.id];
        }
    ]);
});
