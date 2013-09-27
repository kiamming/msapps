/*global require*/
'use strict';

require.config({
    paths: {
        angular: '../bower_components/angular/angular'
    },
    shim: {
        angular: {
            exports: 'angular'
        }
    }
});

require(['angular', 'app', 'controllers/sampleController', 'directives/sampleDirective1'], function (angular) {
    angular.bootstrap(document, ['myApp']);
});
