/*global define*/
'use strict';

define(['app', 'fakeMessages'], function (app, fakeMessages) {
    return app.register.controller('ListController', ['$scope',
        function ListController($scope) {
            $scope.messages = fakeMessages;
        }
    ]);
});
