/*global require*/
'use strict';

require.config({
    paths: {
        angular: '../bower_components/angular/angular',
        ListController: 'controllers/ListController',
        DetailController: 'controllers/DetailController',
        fakeMessages: '../fakeMessages'
    },
    shim: {
        angular: {
            exports: 'angular'
        }
    }
});

require(['angular', 'app', 'ListController', 'DetailController'], function (angular, app) {
    app.config(['$routeProvider',function($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'ListController',
                templateUrl: '../partials/state2.html'
            })
            .when('/view/:id', {
                controller: 'DetailController',
                templateUrl: '../partials/contacts.detail.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
    angular.bootstrap(document, ['myApp']);
});
