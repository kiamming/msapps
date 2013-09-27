/*global require*/
'use strict';

require.config({
    paths: {
        angular: '../bower_components/angular/angular',
        angular_ui_router: '../bower_components/angular/angular-ui-router',
        sample_factory: 'services/sample_factory',
        sample_states: 'states/sample_states'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        angular_ui_router: {
            deps: ['angular']
        },
        sample_factory: {
            deps: ['angular']
        },
        sample_states: {
            deps: ['angular']
        }
    }
});

require(['angular', 'angular_ui_router', 'app', 'sample_factory', 'sample_states'], function (angular) {
    angular.bootstrap(document, ['myApp']);
});
