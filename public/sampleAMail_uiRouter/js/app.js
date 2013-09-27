/*global define*/
'use strict';

define(['angular', 'services/routeResolver'], function (angular) {
    var app = angular.module('myApp', ['routeResolverServices']);

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
        function ($routeProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

            //Change default views and controllers directory using the following:
            //routeResolverProvider.routeConfig.setBaseDirectories('../partials', '/js/controllers');

            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            //Define routes - controllers will be loaded dynamically
            var route = routeResolverProvider.route;

            $routeProvider
                .when('/', route.resolve('List'))
                .when('/view/:id/', route.resolve('Detail'))
                .otherwise({ redirectTo: '/'});
        }]);

    return app;
});
