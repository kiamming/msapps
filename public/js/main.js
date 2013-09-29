/*global require*/
'use strict';

require.config({
    paths: {
        angular: '../bower_components/angular/angular.min',
        angular_ui_router: '../bower_components/angular/angular-ui-router.min',
        angular_ui_bootstrap: '../bower_components/angular/ui-bootstrap-tpls-0.6.0.min',
        jquery: '../bower_components/jquery/jquery-1.8.3.min',
        jquery_keypad: "../bower_components/jquery/jquery.keypad.mod.min",
        flotJS: '../bower_components/flotFiles/jquery.flot.min',
        fastclick: '../bower_components/fastclick/fastclick.min',
        //sample_factory: 'services/sample_factory',
        sample_states: 'states/sample_states',
        visualizeGradIntDirective: 'directives/visualizeGradIntDirective'
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
         'app',
         'sample_states'],
         function (angular) {
            angular.bootstrap(document, ['myApp']);
            require(['fastclick', 'jquery'], function(fastclick) {
                fastclick.attach(document.body);
            });
});


