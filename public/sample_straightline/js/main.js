/*global require*/
'use strict';

require.config({
    paths: {
        angular: '../bower_components/angular/angular.min',
        angular_ui_router: '../bower_components/angular/angular-ui-router.min',
        angular_ui_bootstrap: '../bower_components/angular/ui-bootstrap-tpls-0.6.0.min',
        jquery: '../bower_components/jquery/jquery-1.8.3.min',
        jquery_keypad: "../bower_components/jquery/jquery.keypad.mod",
        flotJS: '../bower_components/flotFiles/jquery.flot.min',
        fastclick: '../bower_components/fastclick/fastclick.min',
        //sample_factory: 'services/sample_factory',
        sample_states: 'states/sample_states',
        sample_directive: 'directives/sampleDirective1'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        angular_ui_router: {
            deps: ['angular']
        },
        angular_ui_bootstrap: {
            deps: ['angular']
        },
        /*sample_factory: {
            deps: ['angular']
        },*/
        sample_states: {
            deps: ['angular', 'app']
        },
        flotJS: {
            deps: ['jquery']
        },
        jquery_keypad: {
            deps: ['jquery']
        }
    }
});

require(['angular',
         'fastclick',
         'angular_ui_router',
         'angular_ui_bootstrap',
         'jquery',
         'app',
         //'sample_factory',
         'sample_states',
         'sample_directive',
         'flotJS',
         'jquery_keypad'],
         function (angular, fastclick) {
    angular.bootstrap(document, ['myApp']);
    fastclick.attach(document.body);
});
