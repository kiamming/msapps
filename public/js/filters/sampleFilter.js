/*global define*/
'use strict';

define(['app'], function (app) {
    app.filter('titleCase', function() {
        return function(input) {
            var words = input.split(' ');
            for (var i = 0; i < words.length; i++) {
                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
            }
            return words.join(' ');
        };
    });
});
