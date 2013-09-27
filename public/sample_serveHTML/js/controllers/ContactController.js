/*global define*/
'use strict';

define(['app'], function (app) {
    return app.controller('ContactController', ['$scope',
        function ContactController($scope) {
            $scope.contacts = ["hi@email.com", "hello@email.com"];
            $scope.add = function() {
                $scope.contacts.push($scope.newcontact);
                $scope.newcontact = "";
            };
        }
    ]);
});
