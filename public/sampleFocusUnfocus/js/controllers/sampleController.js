/*global define*/
'use strict';

/**
 * The main controller for the app.
 */

define(['app'], function (app) {
    return app.controller('SampleController', ['$scope',
        function SampleController($scope) {
            $scope.message = {text : 'nothing clicked yet'};

            $scope.clickUnfocused = function () {
                $scope.message.text = 'unfocused button clicked';
            }

            $scope.clickFocused = function () {
                $scope.message.text = 'focus button clicked';
            }
        }
    ]);
});