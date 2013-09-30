/*global define*/
'use strict';

define(['angular', 'angular_ui_bootstrap', 'angular_ui_router'], function (angular) {
    var app = angular.module('myApp', ['ui.bootstrap', 'ui.router']);

    app.config(function($compileProvider) {
            app.compileProvider = $compileProvider;
         })
         .run(
            [        '$rootScope', '$state', '$stateParams',
            function ($rootScope,   $state,   $stateParams) {

                // It's very handy to add references to $state and $stateParams to the $rootScope
                // so that you can access them from any scope within your applications.For example,
                // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
                // to active whenever 'contacts.list' or one of its decendents is active.
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                $rootScope.nothome = false;
            }]);

    return app;
});
