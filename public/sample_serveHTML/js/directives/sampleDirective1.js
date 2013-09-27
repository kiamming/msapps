/*global define*/
'use strict';

define(['app', 'jquery'], function (app, $) {
    app.directive('special', function () {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                $('#addBtn').on('click', tryingOut);

                function tryingOut() {
                    alert($('#inputMain').val());
                }
            }
        };
    });
});
