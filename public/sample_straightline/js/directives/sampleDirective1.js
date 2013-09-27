/*global define*/
'use strict';

define(['app', 'jquery'], function (app, $) {
    app.directive('special', function () {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {

                ////// Initialization code///////
                var placeholder;
                var graphs = [[]];
                var colorPalette = ['#FF0000'];
                var plot;
                var axes;
                var flot_options;
                var default_flot_options;
                var dummy;
                var xyMin = -5;
                var xyMax = 5;

                var OVERRIDEPREVIOUS = 1; // 1: each new graph to override the previous; 0: old graphs are not erased
                var STEP = 0.1; // Increase/decrease gradient by this amount. Intercept is increased/decreased via a constant multiplier.
                var INITIALGRAD = 0;
                var INITIALINT = 1;

                var currentGradInput = $('#currentGrad');
                var currentIntInput = $('#currentInt');

                placeholder = $('#placeholder');

                flot_options = {
                    series: {
                        lines: { show: true },
                        points: { show: false }
                    },
                    xaxis: {
                        min: xyMin,
                        max: xyMax
                    },
                    yaxis: {
                        min: xyMin,
                        max: xyMax
                    },
                    zoom: {
                        interactive: false
                    },
                    pan: {
                        interactive: false
                    },
                    grid: {
                        backgroundColor: { colors: ["#fff", "#eee"] },
                        markings: [
                            { xaxis: { from: 0, to: 0 }, color: "#000" },
                            { yaxis: { from: 0, to: 0 }, color: "#000" }
                        ]
                    }
                };
                dummy = [];
                dummy.push([xyMin, xyMax+1]);
                dummy.push([xyMax, xyMax+1]);
                default_flot_options = $.extend(true, {}, flot_options);
                default_flot_options.xaxis.min = xyMin;
                default_flot_options.xaxis.max = xyMax;
                default_flot_options.yaxis.min = xyMin;
                default_flot_options.yaxis.max = xyMax;
                plot = $.plot(placeholder, [dummy], default_flot_options);
                axes = plot.getAxes();

                $('#mainContainer').on("touchstart",
                    function (e) {
                        e.preventDefault();
                    });

                $('[name="radioStates"]').on('click', changeView);

                $('#decreaseGrad').on('click', decreaseGrad);
                $('#increaseGrad').on('click', increaseGrad);
                $('#decreaseInt').on('click', decreaseInt);
                $('#increaseInt').on('click', increaseInt);
                $('#resetAll').on('click', resetAll);
                currentGradInput.on('change', replot);
                currentIntInput.on('change', replot);

                /*resizeGraph();

                $(window).bind("resize", function () {
                    resizeGraph();
                    replot();
                });*/

                $(':text').keypad({showOn: 'focus'})
                          .keypad('change', {showAnim: 'fadeIn',
                                             showOptions: null,
                                             duration: 'fast'});

                resetAll();

                ////// End of initialization code///////

                // Utility functions

                function replot() {
                    var thisGraph = [];
                    var currentGrad = parseFloat(currentGradInput.val());
                    var currentInt = parseFloat(currentIntInput.val());

                    thisGraph.push([xyMin, currentGrad*xyMin+currentInt]);
                    thisGraph.push([xyMax, currentGrad*xyMax+currentInt]);

                    if(OVERRIDEPREVIOUS == 1)
                        graphs = [[]];

                    graphs.push({data: thisGraph, color: colorPalette[0]});
                    var current_flot_options = $.extend(true, {}, flot_options);
                    current_flot_options.xaxis.min = axes.xaxis.min.toFixed(2);
                    current_flot_options.xaxis.max = axes.xaxis.max.toFixed(2);
                    current_flot_options.yaxis.min = axes.yaxis.min.toFixed(2);
                    current_flot_options.yaxis.max = axes.yaxis.max.toFixed(2);

                    plot = $.plot(placeholder, graphs, current_flot_options);

                    // Comment the line below to focus the axes when a new graph is drawn
                    axes = plot.getAxes();
                }

                /*function resizeGraph() {
                    placeholder.height(placeholder.width());
                }*/

                function changeView() {
                    var viewRadioButtons = $('[name="radioStates"]');
                    for(var i = 0; i < viewRadioButtons.length; i++) {
                        if(viewRadioButtons.eq(i).hasClass('active')) {
                            OVERRIDEPREVIOUS = viewRadioButtons.eq(i).val();
                            break;
                        }
                    }
                }

                function decreaseGrad() {
                    var temp = parseFloat(currentGradInput.val());
                    temp -= STEP;
                    currentGradInput.val(roundNumber(temp, 2));
                    replot();
                }

                function increaseGrad() {
                    var temp = parseFloat(currentGradInput.val());
                    temp += STEP;
                    currentGradInput.val(roundNumber(temp, 2));
                    replot();
                }

                function decreaseInt() {
                    var temp = parseFloat(currentIntInput.val());
                    temp -= 5*STEP;
                    currentIntInput.val(roundNumber(temp, 2));
                    replot();
                }

                function increaseInt() {
                    var temp = parseFloat(currentIntInput.val());
                    temp += 5*STEP;
                    currentIntInput.val(roundNumber(temp, 2));
                    replot();
                }

                function resetAll() {
                    graphs = [[]];
                    currentGradInput.val(INITIALGRAD);
                    currentIntInput.val(INITIALINT);
                    replot();
                }

                /**
                 * roundNumber(num, dec) rounds a number to a maximum of 2 decimal places
                 */
                function roundNumber(num, dec) {
                    return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
                }
            }
        };
    });
});
