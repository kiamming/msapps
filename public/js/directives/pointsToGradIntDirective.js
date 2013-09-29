/*global define*/
'use strict';

define(['app', 'jquery', 'flotJS', 'jquery_keypad'], function (app, $) {
    app.compileProvider.directive('pointstogradintdirective', function () {
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
                var xyMin = -20;
                var xyMax = 20;

                var currentGradInput = $('#currentGrad');
                var currentIntInput = $('#currentInt');
                var currentGrad = parseFloat(currentGradInput.val());
                var currentInt = parseFloat(currentIntInput.val());

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
                $('.redrawBtns').on('click', replot);

                $(':text').keypad({showOn: 'button',
                    buttonImageOnly: true,
                    buttonImage: '../img/keypad.png'})
                    .keypad('change', {showAnim: 'fadeIn',
                        showOptions: null,
                        duration: 'fast'});
                resetAll();
                ////// End of initialization code///////

                // Utility functions

                function replot() {
                    var thisGraph = [];
                    ensureValidInputs();

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

                    // Show equation of straightline graph
                    showEqnOfLine();
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
                    ensureValidInputs();
                    var temp = parseFloat(currentGradInput.val());
                    temp -= STEP;
                    currentGradInput.val(roundNumber(temp, 2));
                    replot();
                }

                function increaseGrad() {
                    ensureValidInputs();
                    var temp = parseFloat(currentGradInput.val());
                    temp += STEP;
                    currentGradInput.val(roundNumber(temp, 2));
                    replot();
                }

                function decreaseInt() {
                    ensureValidInputs();
                    var temp = parseFloat(currentIntInput.val());
                    temp -= 5*STEP;
                    currentIntInput.val(roundNumber(temp, 2));
                    replot();
                }

                function increaseInt() {
                    ensureValidInputs();
                    var temp = parseFloat(currentIntInput.val());
                    temp += 5*STEP;
                    currentIntInput.val(roundNumber(temp, 2));
                    replot();
                }

                function ensureValidInputs() {
                    var tempGrad = parseFloat(currentGradInput.val());
                    var tempInt = parseFloat(currentIntInput.val());

                    if(isNaN(tempGrad)) {
                        tempGrad = currentGrad;
                        currentGradInput.val(currentGrad);
                    }
                    else{
                        currentGrad = tempGrad;
                    }

                    if(isNaN(tempInt)) {
                        tempInt = currentInt;
                        currentIntInput.val(currentInt);
                    }
                    else{
                        currentInt = tempInt;
                    }
                }

                function resetAll() {
                    graphs = [[]];
                    currentGradInput.val(INITIALGRAD);
                    currentIntInput.val(INITIALINT);
                    replot();
                }

                /**
                 * showEqnOfLine() considers the values of the gradient and intercepts and displays
                 * the equation of the straight line graph in the window in a form that is natural.
                 */
                function showEqnOfLine() {
                    var objCurrentLineMessageBox = $("#currentLineMessageBox");

                    var yVar = "y ", gradVal, xVar = "x", sign12, interceptVal;

                    gradVal = roundNumber(currentGrad, 2);

                    if(gradVal == 0) {
                        gradVal = xVar = "" ;
                        sign12 = "";
                    }
                    else if(gradVal == 1) {
                        gradVal = "";
                        sign12 = " + ";
                    }
                    else {
                        sign12 = " + ";
                    }

                    if(currentInt == 0) {
                        sign12 = "";
                        interceptVal = "";
                    }
                    else if(currentInt < 0) {
                        sign12 = " - ";
                        interceptVal = Math.abs(roundNumber(currentInt, 2));
                    }
                    else {
                        interceptVal = roundNumber(currentInt, 2);
                    }

                    objCurrentLineMessageBox.html(
                        "Equation of last drawn line:<br/>" +
                            "<em>" + yVar + "</em>" + " = " +
                            "<span style='font-weight: bold; color: blue'>" + gradVal + "</span>" +
                            "<em>" + xVar + "</em>" + sign12 +
                            "<span style='font-weight: bold; color: darkgreen'>" + interceptVal + "</span>");
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
