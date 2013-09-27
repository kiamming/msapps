/*global require*/
'use strict';

require.config({
    paths: {
        angular: '../bower_components/angular/angular',
        jquery: '../bower_components/jquery/jquery-1.8.3.min',
        sample_controller: 'controllers/ContactController',
        sample_directive: 'directives/sampleDirective1'
    },
    shim: {
        angular: {
            exports: 'angular'
        }
    }
});

require(['angular',
         'jquery',
         'app',
         'sample_controller',
         'sample_directive'],
         function (angular) {
    angular.bootstrap(document, ['myApp']);
});
