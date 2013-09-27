/*global require*/
'use strict';

require.config({
    paths: {
        angular: '../bower_components/angular/angular',
        fakeMessages: '../fakeMessages'
    },
    shim: {
        angular: {
            exports: 'angular'
        }
    }
});

require(['angular', 'app'], function (angular) {
    angular.bootstrap(document, ['myApp']);
});
