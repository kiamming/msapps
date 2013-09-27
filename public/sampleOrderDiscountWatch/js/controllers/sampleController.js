/*global define*/
'use strict';

/**
 * The main controller for the app.
 */

define(['app'], function (app) {
    return app.controller('SampleController', ['$scope',
        function SampleController($scope) {
            $scope.bill = {};

            $scope.items = [
                {title: 'paint pots', quantity: 8, price: 3.95},
                {title: 'polka dots', quantity: 17, price: 12.95},
                {title: 'pebbles', quantity: 5, price: 6.95}
            ];

            $scope.$watch(function(){
                var subtotal = 0;
                for (var i = 0; i < $scope.items.length; i++) {
                    subtotal = subtotal + $scope.items[i].price * $scope.items[i].quantity;
                }
                $scope.bill.subtotal = subtotal;
                $scope.bill.discount = subtotal > 100 ? 10 : 0;
                $scope.bill.total = subtotal - $scope.bill.discount;
            });
        }
    ]);
});