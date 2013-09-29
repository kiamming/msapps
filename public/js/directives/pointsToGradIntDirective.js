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
                var plot;
                var axes;
                var flot_options;
                var default_flot_options;
                var dummy;
                var xyMin = -20;
                var xyMax = 20;

                var numLinesDrawn = 0; // number of lines now on canvas
                var MAXNUMLINES = 4; // maximum number of lines allowed
                var COLORS = ["red", "blue", "green", "indigo"]; // colors used for drawing lines

                var x1 = $('#x1');
                var y1 = $('#y1');
                var x2 = $('#x2');
                var y2 = $('#y2');
                var messageBoxes = $("[name='messageBoxes']");

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

                $('#resetAll').on('click', resetAll);
                $('#drawLine').on('click', ensureValidInputs);

                $(':text').keypad({showOn: 'button',
                    buttonImageOnly: true,
                    buttonImage: '../img/keypad.png'})
                    .keypad('change', {showAnim: 'fadeIn',
                        showOptions: null,
                        duration: 'fast'});
                //resetAll();
                ////// End of initialization code///////

                // Utility functions

                function replot(gradNintercept, currentColor, verticalLine) {
                    var thisGraph = [];

                    if(!verticalLine) {
                        thisGraph.push([xyMin, gradNintercept.grad*xyMin+gradNintercept.int]);
                        thisGraph.push([xyMax, gradNintercept.grad*xyMax+gradNintercept.int]);
                    }
                    else {
                        var xCoord = gradNintercept;
                        thisGraph.push([xCoord, xyMin]);
                        thisGraph.push([xCoord, xyMax]);
                    }

                    graphs.push({data: thisGraph, color: currentColor});
                    var current_flot_options = $.extend(true, {}, flot_options);
                    current_flot_options.xaxis.min = axes.xaxis.min.toFixed(2);
                    current_flot_options.xaxis.max = axes.xaxis.max.toFixed(2);
                    current_flot_options.yaxis.min = axes.yaxis.min.toFixed(2);
                    current_flot_options.yaxis.max = axes.yaxis.max.toFixed(2);

                    plot = $.plot(placeholder, graphs, current_flot_options);

                    // Comment the line below to focus the axes when a new graph is drawn
                    axes = plot.getAxes();
                }

                function ensureValidInputs() {
                    // Getting references to the message box etc.
                    var currentMessageBox = $("#messageBox" + (numLinesDrawn+1));
                    var coords = new Object();
                    coords.x1 = parseFloat(x1.val());
                    coords.y1 = parseFloat(y1.val());
                    coords.x2 = parseFloat(x2.val());
                    coords.y2 = parseFloat(y2.val());

                    // Keep track of whether the inputs are valid
                    var allInputsValid = true;

                    if(isNaN(coords.x1)) {
                        x1.val('');
                        allInputsValid = false;
                    }
                    if(isNaN(coords.y1)) {
                        y1.val('');
                        allInputsValid = false;
                    }
                    if(isNaN(coords.x2)) {
                        x2.val('');
                        allInputsValid = false;
                    }
                    if(isNaN(coords.y2)) {
                        y2.val('');
                        allInputsValid = false;
                    }

                    if(coords.x1 == coords.x2 && coords.y1 == coords.y2) {
                        currentMessageBox.text("Enter 2 distinct points");
                    }
                    else if(allInputsValid) {
                        if(numLinesDrawn < MAXNUMLINES) {
                            var gradNintercept = calculateGradandIntercept(coords);

                            // displaying the equation of the straight line graph in the window in a form that is natural.
                            var statement0, statement1, sign12, statement2;
                            if(gradNintercept.grad === gradNintercept.grad) {
                                replot(gradNintercept, COLORS[numLinesDrawn], false);

                                statement0 = "y = ";

                                // Dealing with different forms of gradient
                                if(gradNintercept.grad == 0) {
                                    statement1 = "" ;
                                    sign12 = "";
                                }
                                else if(gradNintercept.grad == 1) {
                                    statement1 = "x";
                                    sign12 = " + ";
                                }
                                else if(gradNintercept.grad == -1) {
                                    statement1 = "-x";
                                    sign12 = " + ";
                                }
                                else {
                                    statement1 = roundNumber(gradNintercept.grad, 2) + "x";
                                    sign12 = " + ";
                                }

                                // Dealing with different forms of intercepts
                                if(gradNintercept.int == 0) {
                                    sign12 = "";
                                    statement2 = "";
                                }
                                else if(gradNintercept.int < 0) {
                                    sign12 = " - ";
                                    statement2 = Math.abs(roundNumber(gradNintercept.int, 2));
                                }
                                else {
                                    statement2 = roundNumber(gradNintercept.int, 2);
                                }
                            }
                            else{
                                replot(coords.x1, COLORS[numLinesDrawn], true);

                                statement0 = "x = " + roundNumber(coords.x1, 2);
                                statement1 = "   ";
                                sign12 = "";
                                statement2 = "(Gradient undefined)";
                            }

                            currentMessageBox.text(statement0 + statement1 + sign12 + statement2);
                            numLinesDrawn++;
                        }
                        else currentMessageBox.html("Max number of lines = " + MAXNUMLINES +
                            "<br/>Please clear canvas.");
                    }
                    else {
                        currentMessageBox.text("Enter only numeric values.");
                    }
                }

                function resetAll() {
                    graphs = [[]];
                    numLinesDrawn = 0;
                    messageBoxes.each(function() {
                        $(this).text("");
                    });
                    var dummyGradNIntercept = new Object();
                    dummyGradNIntercept.grad = 0;
                    dummyGradNIntercept.int = 100;
                    replot(dummyGradNIntercept, COLORS[0]);
                }

                /**
                 * calculateGradandIntercept(coords) calculates the gradient and intercept based on 2 points.
                 */
                function calculateGradandIntercept(coords) {
                    var gradNintercept = new Object();

                    if(coords.x1 == coords.x2) {
                        gradNintercept.grad = NaN;
                        gradNintercept.int = NaN;
                    }
                    else {
                        gradNintercept.grad = (coords.y2 - coords.y1) / (coords.x2 - coords.x1);
                        gradNintercept.int = coords.y1 - gradNintercept.grad*coords.x1;
                    }
                    return gradNintercept;
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
