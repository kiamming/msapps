// Make sure to include the `ui.router` module as a dependency.
angular.module('myApp')
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////

        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
        $urlRouterProvider

          // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
          // Here we are just setting up some convenience urls.
//          .when('/c?id', '/contacts/:id')
//          .when('/user/:id', '/contacts/:id')

          // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
          .otherwise('/');


        //////////////////////////
        // State Configurations //
        //////////////////////////

        // Use $stateProvider to configure your states.
        $stateProvider

          //////////
          // Home //
          //////////

          .state("home", {

            // Use a url of "/" to set a state as the "index".
            url: "/",

            templateUrl: '../partials/home.html'
          })

            //////////////////////////////////////////////////////////////
            // Visualize Gradient and Intercept of Straight Line Graphs //
            //////////////////////////////////////////////////////////////

            .state('visualizeGradientIntercept', {

                // Use a url of "/visualizeGradientIntercept" to set a state as "visualizeGradientIntercept".
                url: '/visualizeGradientIntercept',

                resolve:
                    [function($q, $rootScope) {
                        var deferred = $q.defer();
                        require(['visualizeGradIntDirective'], function() {
                            $rootScope.$apply(function(){
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }],

                views: {
                    // So this one is targeting the unnamed view within the parent state's template.
                    '': {
                        templateUrl: '../partials/visualizeGradientIntercept.html',
                        controller: ['$scope', '$state',
                            function ($scope, $state) {
                                $scope.behavior = 'override';
                            }]
                    },

                    // This one is targeting the ui-view="hint" within the unnamed root, aka index.html.
                    // This shows off how you could populate *any* view within *any* ancestor state.
                    'hint@': {
                        template: 'Visualize Gradient and Intercept'
                    }
                }
            })

              /////////////////////////////////
              // Plot a line from two points //
              /////////////////////////////////

              .state('pointsToGradientIntercept', {

                  // Use a url of "/pointsToGradientIntercept" to set a state as "visualizeGradientIntercept".
                  url: '/pointsToGradientIntercept',

                  resolve:
                    [function($q, $rootScope) {
                        var deferred = $q.defer();
                        require(['pointsToGradIntDirective'], function() {
                            $rootScope.$apply(function(){
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }],

                  views: {
                      // So this one is targeting the unnamed view within the parent state's template.
                      '': {
                          templateUrl: '../partials/pointsToGradientIntercept.html',
                          controller: ['$scope', '$state',
                              function (  $scope,   $state) {
                                  //$scope.behavior = 'override';
                              }]
                      },

                      // This one is targeting the ui-view="hint" within the unnamed root, aka index.html.
                      // This shows off how you could populate *any* view within *any* ancestor state.
                      'hint@': {
                          template: 'Plot a line from two points'
                      }
                  }
              })

          ///////////
          // About //
          ///////////

          .state('about', {
            url: '/about',
            templateUrl: '../partials/about.html'
            // Showing off how you could return a promise from templateProvider
            /*templateProvider: ['$timeout',
              function (        $timeout) {
                return $timeout(function () {
                  return '<p class="lead">About this app</p><ul>' +
                         'This app is developed using the open-source technologies listed below'
                }, 100);
              }]*/
          })
      }]);
