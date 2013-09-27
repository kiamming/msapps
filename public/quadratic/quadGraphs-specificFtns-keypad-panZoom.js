var quadGraphs_placeholder;
var quadGraphs_graphs = [[], [], []];
var quadGraphs_colorPalette = ['#FF0000', '#0000FF', '#006600'];
var quadGraphs_zoomOutSrc = 'images/zoomout.png';
var quadGraphs_zoomInSrc = 'images/zoomin.png';
var quadGraphs_defaultBtn = 'images/defaultBtn.png';

var quadGraphs_plot;
var quadGraphs_axes;
var quadGraphs_flot_options;
var quadGraphs_default_flot_options;
var quadGraphs_dummy;
var quadGraphs_xyMin = -50;
var quadGraphs_xyMax = 50;

var quadGraphs_xMin = -10;
var quadGraphs_xMax = 10;
var quadGraphs_xNumTicks = quadGraphs_xMax - quadGraphs_xMin;

var quadGraphs_yMin = -10;
var quadGraphs_yMax = 10;
var quadGraphs_yNumTicks = quadGraphs_yMax - quadGraphs_yMin;

var quadGraphs_ZoomInButton;
var quadGraphs_ZoomOutButton;
var quadGraphs_DefaultZoomButton;

var quadGraphs_mul = 0.005;
var quadGraphs_offset = 0.1;

var quadGraphs_step = 0.1;
var quadGraphs_REPEAT = 250; // repeat the functions called when the mouse is held down by REPEAT ms.

function quadGraphs_init() {
	$( "#exp1" ).tabs();
	$( "#exp2" ).tabs();
	$( "#exp3" ).tabs();
	
	quadGraphs_placeholder = $('#placeholder');
	quadGraphs_flot_options = {
        series: {
            lines: { show: true },
            points: { show: false }
        },
        xaxis: {
		    // min: quadGraphs_xMin,
            //max: quadGraphs_xMax,
			zoomRange: [0.1, 50], 
			panRange: [-50, 50]
        },
        yaxis: {
		    //min: quadGraphs_yMin,
            //max: quadGraphs_yMax,		
			zoomRange: [0.1, 50], 
			panRange: [-50, 50]
        },
        zoom: {
            interactive: true
        },
        pan: {
            interactive: true
        },		
        grid: {
            backgroundColor: { colors: ["#fff", "#eee"] },
			markings: [ 
						{ xaxis: { from: 0, to: 0 }, color: "#000" },
						{ yaxis: { from: 0, to: 0 }, color: "#000" },
					  ]
        }
    };
	quadGraphs_dummy = [];
	quadGraphs_dummy.push([-10, quadGraphs_xyMax+1]);
	quadGraphs_dummy.push([10, quadGraphs_xyMax+1]);
	quadGraphs_default_flot_options = $.extend(true, {}, quadGraphs_flot_options);
	quadGraphs_default_flot_options.xaxis.min = quadGraphs_xMin;
	quadGraphs_default_flot_options.xaxis.max = quadGraphs_xMax;
	quadGraphs_default_flot_options.yaxis.min = quadGraphs_yMin;
	quadGraphs_default_flot_options.yaxis.max = quadGraphs_yMax;	
	quadGraphs_plot = $.plot(quadGraphs_placeholder, [quadGraphs_dummy], quadGraphs_default_flot_options);
	quadGraphs_axes = quadGraphs_plot.getAxes();
	
    // add zooming buttons
	quadGraphs_ZoomOutButton = $('<img class="quadGraphs_zoomicons" style="left:40px;top:20px" />')
							   .attr('src', quadGraphs_zoomOutSrc);
	quadGraphs_DefaultZoomButton = $('<img class="quadGraphs_defaultbtncss" style="left:70px;top:20px" />')
								.attr('src', quadGraphs_defaultBtn);
	quadGraphs_ZoomInButton = $('<img class="quadGraphs_zoomicons" style="left:130px;top:20px" />')
							   .attr('src', quadGraphs_zoomInSrc);					   
	appendButtons();
	appendArrows();
	
	$('.plotButton').on('click', replot);
	$('.clearButton').on('click', clearPlot);
	$('.discreteChange').mousehold(quadGraphs_REPEAT, executeDiscreteChange)
						.touchhold(executeDiscreteChange); // added to take care of touch events
}

function appendButtons() {
    // add zoom out button 
    quadGraphs_ZoomOutButton.appendTo(quadGraphs_placeholder).click(function (e) {
        e.preventDefault();
        quadGraphs_plot.zoomOut();
    });	
	
    // add zoom out button 
    quadGraphs_DefaultZoomButton.appendTo(quadGraphs_placeholder).click(function (e) {
        e.preventDefault();
		var checkAtLeastOneGraphPlotted = false;
		var dummyOrGraphs = [quadGraphs_dummy];
		for(var g in quadGraphs_graphs) {
			if(g.length != 0) {
				checkAtLeastOneGraphPlotted = true;
				break;
			}
		}
		
		if(checkAtLeastOneGraphPlotted)
			dummyOrGraphs = quadGraphs_graphs;
			
        quadGraphs_plot = $.plot(quadGraphs_placeholder, dummyOrGraphs, quadGraphs_default_flot_options);
		appendButtons();
		appendArrows();
    });		
	
    // add zoom in button 
    quadGraphs_ZoomInButton.appendTo(quadGraphs_placeholder).click(function (e) {
        e.preventDefault();
        quadGraphs_plot.zoom();
    });
	
	quadGraphs_placeholder.on('scroll', function(e) {
		e.preventDefault();
	});
}

function appendArrows() {
	// add panning arrows
    function addArrow(dir, left, top, offset) {
        $('<img class="button" src="images/arrow-' + dir + '.png" style="position:absolute;left:' + left + 'px;top:' + top + 'px">')
		 .appendTo(quadGraphs_placeholder)
		 .click(function (e) {
            e.preventDefault();
            quadGraphs_plot.pan(offset);
        });
    }

	addArrow('left', 418, 440, { left: -100 });
    addArrow('right', 494, 440, { left: 100 });
    addArrow('up', 458, 399, { top: -100 });
    addArrow('down', 458, 475, { top: 100 });			
}

function replot() {
	var classList = $(this).attr('class').split(/\s+/);
	var thisGraphClass = '.' + classList[0];
	var thisForm = '.' + classList[1];
	var thisID = classList[0].slice(-1);
	
	var cst1 = parseFloat($(thisGraphClass + thisForm + '.userInputs.constant1').val());
	var cst2 = parseFloat($(thisGraphClass + thisForm + '.userInputs.constant2').val());
	var cst3 = parseFloat($(thisGraphClass + thisForm + '.userInputs.constant3').val());
	
	var checkForNumericalInputs = true;
	
	if(isNaN(cst1)) { 
		$(thisGraphClass + thisForm + '.userInputs.constant1').val('');
		checkForNumericalInputs = false;
	}
	if(isNaN(cst2)) { 
		$(thisGraphClass + thisForm + '.userInputs.constant2').val('');
		checkForNumericalInputs = false;
	}
	if(isNaN(cst3)) { 
		$(thisGraphClass + thisForm + '.userInputs.constant3').val('');
		checkForNumericalInputs = false;
	}
	if(!checkForNumericalInputs)
		return false;
	
	$(thisGraphClass + thisForm + '.userInputs.constant1').val(cst1);
	$(thisGraphClass + thisForm + '.userInputs.constant2').val(cst2);
	$(thisGraphClass + thisForm + '.userInputs.constant3').val(cst3);
	
	var constantsInputted;
	
	var thisLabel = "y"+thisID+"(x)";
	var thisGraph = [];
	
	switch(thisForm) {
		case ".general":
			constantsInputted = [cst1, cst2, cst3];
			populateFactorizedAndVertex(thisID, constantsInputted);
			generateFromGeneral(thisGraph, thisID, constantsInputted);
			break;
		case ".factorized":
			constantsInputted = [cst1, cst2, cst3];
			populateGeneralAndVertex(thisID, constantsInputted);
			generateFromFactorized(thisGraph, thisID, constantsInputted);
			break;
		case ".vertex":
			constantsInputted = [cst1, cst2, cst3];
			populateGeneralAndFactorized(thisID, constantsInputted);
			generateFromVertex(thisGraph, thisID, constantsInputted);
			break;			
	}

	quadGraphs_graphs[thisID-1] = {label: thisLabel,  data: thisGraph, color: quadGraphs_colorPalette[thisID-1]};	
	var current_flot_options = $.extend(true, {}, quadGraphs_flot_options);
	current_flot_options.xaxis.min = quadGraphs_axes.xaxis.min.toFixed(2);
	current_flot_options.xaxis.max = quadGraphs_axes.xaxis.max.toFixed(2);
	current_flot_options.yaxis.min = quadGraphs_axes.yaxis.min.toFixed(2);
	current_flot_options.yaxis.max = quadGraphs_axes.yaxis.max.toFixed(2);

    quadGraphs_plot = $.plot(quadGraphs_placeholder, quadGraphs_graphs, current_flot_options);
	appendButtons();
	appendArrows();
	
	// Comment the line below to focus the axes when a new graph is drawn
	quadGraphs_axes = quadGraphs_plot.getAxes();
}

function populateFactorizedAndVertex(thisID, constantsInputted) {
	var a = constantsInputted[0];
	var b = constantsInputted[1];
	var c = constantsInputted[2];
	
	// Evaluate respective constants in roots expression
	var m, n;
	var discriminant = square(b) - 4*a*c;
	if(discriminant < 0)
		m = n = 'NA';
	else {
		m = roundNumber((-b-Math.sqrt(discriminant))/(2*a), 2);
		n = roundNumber((-b+Math.sqrt(discriminant))/(2*a), 2);
	}

	$('.graph'+thisID+'.factorized.userInputs.constant1').val(a);
	$('.graph'+thisID+'.factorized.userInputs.constant2').val(m);
	$('.graph'+thisID+'.factorized.userInputs.constant3').val(n);
	
	// Evaluate respective constants in completed square expression
	var p = roundNumber(-b/(2*a), 2);
	var q = roundNumber(c-square(b)/(4*a), 2); 
	
	$('.graph'+thisID+'.vertex.userInputs.constant1').val(a);
	$('.graph'+thisID+'.vertex.userInputs.constant2').val(p);
	$('.graph'+thisID+'.vertex.userInputs.constant3').val(q);
}

function populateGeneralAndVertex(thisID, constantsInputted) {
	var a = constantsInputted[0];
	var m = constantsInputted[1];
	var n = constantsInputted[2];
	
	if(isNaN(a) || isNaN(m) || isNaN(n))
		return false;

	// Evaluate respective constants in general expression
	var b = roundNumber(-a*(m+n), 2);
	var c = roundNumber(a*m*n, 2);

	$('.graph'+thisID+'.general.userInputs.constant1').val(a);
	$('.graph'+thisID+'.general.userInputs.constant2').val(b);
	$('.graph'+thisID+'.general.userInputs.constant3').val(c);
	
	// Evaluate respective constants in completed square expression
	var p = roundNumber((m+n)/2, 2);
	var q = roundNumber(-(a/4)*(m-n)*(m-n), 2); 
	
	$('.graph'+thisID+'.vertex.userInputs.constant1').val(a);
	$('.graph'+thisID+'.vertex.userInputs.constant2').val(p);
	$('.graph'+thisID+'.vertex.userInputs.constant3').val(q);
}

function populateGeneralAndFactorized(thisID, constantsInputted) {
	var a = constantsInputted[0];
	var p = constantsInputted[1];
	var q = constantsInputted[2];
	
	if(isNaN(a) || isNaN(p) || isNaN(q))
		return false;
	
	// Evaluate respective constants in general expression
	var b = roundNumber(-2*a*p, 2);
	var c = roundNumber(a*square(p)+q, 2);

	$('.graph'+thisID+'.general.userInputs.constant1').val(a);
	$('.graph'+thisID+'.general.userInputs.constant2').val(b);
	$('.graph'+thisID+'.general.userInputs.constant3').val(c);
		
	// Evaluate respective constants in roots expression
	var m, n;
	var check = -q/a;
	if(check < 0)
		m = n = 'NA';
	else {
		m = roundNumber(p-Math.sqrt(check), 2);
		n = roundNumber(p+Math.sqrt(check), 2);
	}

	$('.graph'+thisID+'.factorized.userInputs.constant1').val(a);
	$('.graph'+thisID+'.factorized.userInputs.constant2').val(m);
	$('.graph'+thisID+'.factorized.userInputs.constant3').val(n);
}

function generateFromGeneral(thisGraph, thisID, constantsInputted) {
	var a = constantsInputted[0];
	var b = constantsInputted[1];
	var c = constantsInputted[2];
	var p = $('.graph'+thisID+'.vertex.userInputs.constant2').val(); // x-coordinate of vertex
	
	if(a != 0) {
		var counter = quadGraphs_xyMin;
		while(counter < quadGraphs_xyMax) {
			thisGraph.push([counter, a*counter*counter + b*counter + c]);
			counter = counter + quadGraphs_mul*square(counter-p)+quadGraphs_offset;
		}
	}
	else {
		thisGraph.push([quadGraphs_xyMin, b*quadGraphs_xyMin + c]);
		thisGraph.push([quadGraphs_xyMax, b*quadGraphs_xyMax + c]);
	}
}

function generateFromFactorized(thisGraph, thisID, constantsInputted) {
	var a = constantsInputted[0];
	var m = constantsInputted[1];
	var n = constantsInputted[2];
	var p = $('.graph'+thisID+'.vertex.userInputs.constant2').val(); // x-coordinate of vertex
	
	var counter = quadGraphs_xyMin;
	while(counter < quadGraphs_xyMax) {
		thisGraph.push([counter, a*(counter-m)*(counter-n)]);
		counter = counter + quadGraphs_mul*square(counter-p)+quadGraphs_offset;
	}	
}

function generateFromVertex(thisGraph, thisID, constantsInputted) {
	var a = constantsInputted[0];
	var p = constantsInputted[1]; // x-coordinate of vertex
	var q = constantsInputted[2];
	
	var counter = quadGraphs_xyMin;
	while(counter < quadGraphs_xyMax) {
		thisGraph.push([counter, a*square(counter-p)+q]);
		counter = counter + quadGraphs_mul*square(counter-p)+quadGraphs_offset;
	}
}

function clearPlot() {
	var classList = $(this).attr('class').split(/\s+/);
	var thisID = classList[0].slice(-1);	
	quadGraphs_graphs[thisID-1] = [];	

	var current_flot_options = $.extend(true, {}, quadGraphs_flot_options);
	current_flot_options.xaxis.min = quadGraphs_axes.xaxis.min.toFixed(2);
	current_flot_options.xaxis.max = quadGraphs_axes.xaxis.max.toFixed(2);
	current_flot_options.yaxis.min = quadGraphs_axes.yaxis.min.toFixed(2);
	current_flot_options.yaxis.max = quadGraphs_axes.yaxis.max.toFixed(2);
	
    quadGraphs_plot = $.plot(quadGraphs_placeholder, quadGraphs_graphs, current_flot_options);
	appendButtons();
	appendArrows();
	quadGraphs_axes = quadGraphs_plot.getAxes();	
}

function executeDiscreteChange() {
	var currentConstant;
	var classList = $(this).attr('class').split(/\s+/);
	var thisGraphClass = '.' + classList[0];	
	var thisForm = '.' + classList[1];
	var thisConstant = '.' + classList[3];
	
	var $correspondingConstant = $(thisGraphClass + thisForm + '.userInputs' + thisConstant);
	currentConstant = parseFloat($correspondingConstant.val());

	if(isNaN(currentConstant)) 
		currentConstant = 0;	

	var action = $(this).data('action');
	if(action == "inc")
		$correspondingConstant.val(roundNumber(currentConstant+quadGraphs_step, 2));
	else if(action == "dec")
		$correspondingConstant.val(roundNumber(currentConstant-quadGraphs_step, 2));
	
	$(thisGraphClass + thisForm + '.plotButton').trigger('click');
}

function wrap(cst) {
	if(cst >= 0) return cst;
	else return '('+cst+')';
}

function square(cst) {
	return cst*cst;
}

/**
 * roundNumber(num, dec) rounds a number to a maximum of 2 decimal places
 */
function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}