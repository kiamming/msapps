/*global define*/
'use strict';

define(['app'], function (app) {
    app.directive('ngbkFocus', function () {
        return {
            link: function(scope, element, attrs, controller) {
                element[0].focus();
            }
        };
    });
});
