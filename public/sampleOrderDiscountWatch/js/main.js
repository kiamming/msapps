/*global require*/
'use strict';

require.config({
    paths: {
        angular: '../bower_components/angular/angular',
        sampleController: 'controllers/sampleController',
        sampleDirective : 'directives/sampleDirective1',
        sampleFilter : 'filters/sampleFilter'
    },
    shim: {
        angular: {
            exports: 'angular'
        }
    }
});

require(['angular', 'app', 'sampleController', 'sampleDirective', 'sampleFilter'], function (angular) {
    angular.bootstrap(document, ['myApp']);
});
