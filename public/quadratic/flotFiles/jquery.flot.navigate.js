/*
Flot plugin for adding panning and zooming capabilities to a plot.

The default behaviour is double click and scrollwheel up/down to zoom
in, drag to pan. The plugin defines plot.zoom({ center }),
plot.zoomOut() and plot.pan(offset) so you easily can add custom
controls. It also fires a "plotpan" and "plotzoom" event when
something happens, useful for synchronizing plots.

Options:

  zoom: {
    interactive: false
    trigger: "dblclick" // or "click" for single click
    amount: 1.5         // 2 = 200% (zoom in), 0.5 = 50% (zoom out)
  }
  
  pan: {
    interactive: false
    cursor: "move"      // CSS mouse cursor value used when dragging, e.g. "pointer"
    frameRate: 20
  }

  xaxis, yaxis, x2axis, y2axis: {
    zoomRange: null  // or [number, number] (min range, max range) or false
    panRange: null   // or [number, number] (min, max) or false
  }
  
"interactive" enables the built-in drag/click behaviour. If you enable
interactive for pan, then you'll have a basic plot that supports
moving around; the same for zoom.

"amount" specifies the default amount to zoom in (so 1.5 = 150%)
relative to the current viewport.

"cursor" is a standard CSS mouse cursor string used for visual
feedback to the user when dragging.

"frameRate" specifies the maximum number of times per second the plot
will update itself while the user is panning around on it (set to null
to disable intermediate pans, the plot will then not update until the
mouse button is released).

"zoomRange" is the interval in which zooming can happen, e.g. with
zoomRange: [1, 100] the zoom will never scale the axis so that the
difference between min and max is smaller than 1 or larger than 100.
You can set either end to null to ignore, e.g. [1, null]. If you set
zoomRange to false, zooming on that axis will be disabled.

"panRange" confines the panning to stay within a range, e.g. with
panRange: [-10, 20] panning stops at -10 in one end and at 20 in the
other. Either can be null, e.g. [-10, null]. If you set
panRange to false, panning on that axis will be disabled.

Example API usage:

  plot = $.plot(...);
  
  // zoom default amount in on the pixel (10, 20) 
  plot.zoom({ center: { left: 10, top: 20 } });

  // zoom out again
  plot.zoomOut({ center: { left: 10, top: 20 } });

  // zoom 200% in on the pixel (10, 20) 
  plot.zoom({ amount: 2, center: { left: 10, top: 20 } });
  
  // pan 100 pixels to the left and 20 down
  plot.pan({ left: -100, top: 20 })

Here, "center" specifies where the center of the zooming should
happen. Note that this is defined in pixel space, not the space of the
data points (you can use the p2c helpers on the axes in Flot to help
you convert between these).

"amount" is the amount to zoom the viewport relative to the current
range, so 1 is 100% (i.e. no change), 1.5 is 150% (zoom in), 0.7 is
70% (zoom out). You can set the default in the options.
  
*/


// First two dependencies, jquery.event.drag.js and
// jquery.mousewheel.js, we put them inline here to save people the
// effort of downloading them.

/*
jquery.event.drag.js ~ v2.2 ~ Copyright (c) 2010, Three Dub Media (http://threedubmedia.com)  
Licensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt
*/
(function(e){e.fn.drag=function(k,g,j){var i=typeof k=="string"?k:"",h=e.isFunction(k)?k:e.isFunction(g)?g:null;if(i.indexOf("drag")!==0){i="drag"+i}j=(k==h?g:j)||{};return h?this.bind(i,j,h):this.trigger(i)};var b=e.event,a=b.special,d=a.drag={defaults:{which:1,distance:0,not:":input",handle:null,relative:false,drop:true,click:false},datakey:"dragdata",noBubble:true,add:function(i){var h=e.data(this,d.datakey),g=i.data||{};h.related+=1;e.each(d.defaults,function(j,k){if(g[j]!==undefined){h[j]=g[j]}})},remove:function(){e.data(this,d.datakey).related-=1},setup:function(){if(e.data(this,d.datakey)){return}var g=e.extend({related:0},d.defaults);e.data(this,d.datakey,g);b.add(this,"touchstart mousedown",d.init,g);if(this.attachEvent){this.attachEvent("ondragstart",d.dontstart)}},teardown:function(){var g=e.data(this,d.datakey)||{};if(g.related){return}e.removeData(this,d.datakey);b.remove(this,"touchstart mousedown",d.init);d.textselect(true);if(this.detachEvent){this.detachEvent("ondragstart",d.dontstart)}},init:function(i){if(d.touched){return}var g=i.data,h;if(i.which!=0&&g.which>0&&i.which!=g.which){return}if(e(i.target).is(g.not)){return}if(g.handle&&!e(i.target).closest(g.handle,i.currentTarget).length){return}d.touched=i.type=="touchstart"?this:null;g.propagates=1;g.mousedown=this;g.interactions=[d.interaction(this,g)];g.target=i.target;g.pageX=i.pageX;g.pageY=i.pageY;g.dragging=null;h=d.hijack(i,"draginit",g);if(!g.propagates){return}h=d.flatten(h);if(h&&h.length){g.interactions=[];e.each(h,function(){g.interactions.push(d.interaction(this,g))})}g.propagates=g.interactions.length;if(g.drop!==false&&a.drop){a.drop.handler(i,g)}d.textselect(false);if(d.touched){b.add(d.touched,"touchmove touchend",d.handler,g)}else{b.add(document,"mousemove mouseup",d.handler,g)}if(!d.touched||g.live){return false}},interaction:function(h,g){var i=e(h)[g.relative?"position":"offset"]()||{top:0,left:0};return{drag:h,callback:new d.callback(),droppable:[],offset:i}},handler:function(h){var g=h.data;switch(h.type){case !g.dragging&&"touchmove":h.preventDefault();case !g.dragging&&"mousemove":if(Math.pow(h.pageX-g.pageX,2)+Math.pow(h.pageY-g.pageY,2)<Math.pow(g.distance,2)){break}h.target=g.target;d.hijack(h,"dragstart",g);if(g.propagates){g.dragging=true}case"touchmove":h.preventDefault();case"mousemove":if(g.dragging){d.hijack(h,"drag",g);if(g.propagates){if(g.drop!==false&&a.drop){a.drop.handler(h,g)}break}h.type="mouseup"}case"touchend":case"mouseup":default:if(d.touched){b.remove(d.touched,"touchmove touchend",d.handler)}else{b.remove(document,"mousemove mouseup",d.handler)}if(g.dragging){if(g.drop!==false&&a.drop){a.drop.handler(h,g)}d.hijack(h,"dragend",g)}d.textselect(true);if(g.click===false&&g.dragging){e.data(g.mousedown,"suppress.click",new Date().getTime()+5)}g.dragging=d.touched=false;break}},hijack:function(h,o,r,p,k){if(!r){return}var q={event:h.originalEvent,type:h.type},m=o.indexOf("drop")?"drag":"drop",t,l=p||0,j,g,s,n=!isNaN(p)?p:r.interactions.length;h.type=o;h.originalEvent=null;r.results=[];do{if(j=r.interactions[l]){if(o!=="dragend"&&j.cancelled){continue}s=d.properties(h,r,j);j.results=[];e(k||j[m]||r.droppable).each(function(u,i){s.target=i;h.isPropagationStopped=function(){return false};t=i?b.dispatch.call(i,h,s):null;if(t===false){if(m=="drag"){j.cancelled=true;r.propagates-=1}if(o=="drop"){j[m][u]=null}}else{if(o=="dropinit"){j.droppable.push(d.element(t)||i)}}if(o=="dragstart"){j.proxy=e(d.element(t)||j.drag)[0]}j.results.push(t);delete h.result;if(o!=="dropinit"){return t}});r.results[l]=d.flatten(j.results);if(o=="dropinit"){j.droppable=d.flatten(j.droppable)}if(o=="dragstart"&&!j.cancelled){s.update()}}}while(++l<n);h.type=q.type;h.originalEvent=q.event;return d.flatten(r.results)},properties:function(i,g,h){var j=h.callback;j.drag=h.drag;j.proxy=h.proxy||h.drag;j.startX=g.pageX;j.startY=g.pageY;j.deltaX=i.pageX-g.pageX;j.deltaY=i.pageY-g.pageY;j.originalX=h.offset.left;j.originalY=h.offset.top;j.offsetX=j.originalX+j.deltaX;j.offsetY=j.originalY+j.deltaY;j.drop=d.flatten((h.drop||[]).slice());j.available=d.flatten((h.droppable||[]).slice());return j},element:function(g){if(g&&(g.jquery||g.nodeType==1)){return g}},flatten:function(g){return e.map(g,function(h){return h&&h.jquery?e.makeArray(h):h&&h.length?d.flatten(h):h})},textselect:function(g){e(document)[g?"unbind":"bind"]("selectstart",d.dontstart).css("MozUserSelect",g?"":"none");document.unselectable=g?"off":"on"},dontstart:function(){return false},callback:function(){}};d.callback.prototype={update:function(){if(a.drop&&this.available.length){e.each(this.available,function(g){a.drop.locate(this,g)})}}};var f=b.dispatch;b.dispatch=function(g){if(e.data(this,"suppress."+g.type)-new Date().getTime()>0){e.removeData(this,"suppress."+g.type);return}return f.apply(this,arguments)};var c=b.fixHooks.touchstart=b.fixHooks.touchmove=b.fixHooks.touchend=b.fixHooks.touchcancel={props:"clientX clientY pageX pageY screenX screenY".split(" "),filter:function(h,i){if(i){var g=(i.touches&&i.touches[0])||(i.changedTouches&&i.changedTouches[0])||null;if(g){e.each(c.props,function(j,k){h[k]=g[k]})}}return h}};a.draginit=a.dragstart=a.dragend=d})(jQuery);


/* jquery.mousewheel.min.js
 * Copyright (c) 2009 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * Version: 3.1.3
 * 
 * Requires: 1.2.2+
 */
 (function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a)}else{if(typeof exports==="object"){module.exports=a}else{a(jQuery)}}}(function(e){var d=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"];var g="onwheel" in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"];var f,a;if(e.event.fixHooks){for(var b=d.length;b;){e.event.fixHooks[d[--b]]=e.event.mouseHooks}}e.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var h=g.length;h;){this.addEventListener(g[--h],c,false)}}else{this.onmousewheel=c}},teardown:function(){if(this.removeEventListener){for(var h=g.length;h;){this.removeEventListener(g[--h],c,false)}}else{this.onmousewheel=null}}};e.fn.extend({mousewheel:function(h){return h?this.bind("mousewheel",h):this.trigger("mousewheel")},unmousewheel:function(h){return this.unbind("mousewheel",h)}});function c(h){var i=h||window.event,n=[].slice.call(arguments,1),p=0,k=0,j=0,m=0,l=0,o;h=e.event.fix(i);h.type="mousewheel";if(i.wheelDelta){p=i.wheelDelta}if(i.detail){p=i.detail*-1}if(i.deltaY){j=i.deltaY*-1;p=j}if(i.deltaX){k=i.deltaX;p=k*-1}if(i.wheelDeltaY!==undefined){j=i.wheelDeltaY}if(i.wheelDeltaX!==undefined){k=i.wheelDeltaX*-1}m=Math.abs(p);if(!f||m<f){f=m}l=Math.max(Math.abs(j),Math.abs(k));if(!a||l<a){a=l}o=p>0?"floor":"ceil";p=Math[o](p/f);k=Math[o](k/a);j=Math[o](j/a);n.unshift(h,p,k,j);return(e.event.dispatch||e.event.handle).apply(this,n)}}));




(function ($) {
    var options = {
        xaxis: {
            zoomRange: null, // or [number, number] (min range, max range)
            panRange: null // or [number, number] (min, max)
        },
        zoom: {
            interactive: false,
            trigger: "dblclick", // or "click" for single click
            amount: 1.5 // how much to zoom relative to current position, 2 = 200% (zoom in), 0.5 = 50% (zoom out)
        },
        pan: {
            interactive: false,
            cursor: "move",
            frameRate: 20
        }
    };

    function init(plot) {
        function onZoomClick(e, zoomOut) {
            var c = plot.offset();
            c.left = e.pageX - c.left;
            c.top = e.pageY - c.top;
            if (zoomOut)
                plot.zoomOut({ center: c });
            else
                plot.zoom({ center: c });
        }

        function onMouseWheel(e, delta) {
            onZoomClick(e, delta < 0);
            return false;
        }
        
        var prevCursor = 'default', prevPageX = 0, prevPageY = 0,
            panTimeout = null;

        function onDragStart(e) {
            if (e.which != 1)  // only accept left-click
                return false;
            var c = plot.getPlaceholder().css('cursor');
            if (c)
                prevCursor = c;
            plot.getPlaceholder().css('cursor', plot.getOptions().pan.cursor);
            prevPageX = e.pageX;
            prevPageY = e.pageY;
        }
        
        function onDrag(e) {
            var frameRate = plot.getOptions().pan.frameRate;
            if (panTimeout || !frameRate)
                return;

            panTimeout = setTimeout(function () {
                plot.pan({ left: prevPageX - e.pageX,
                           top: prevPageY - e.pageY });
                prevPageX = e.pageX;
                prevPageY = e.pageY;
                                                    
                panTimeout = null;
            }, 1 / frameRate * 1000);
        }

        function onDragEnd(e) {
            if (panTimeout) {
                clearTimeout(panTimeout);
                panTimeout = null;
            }
                    
            plot.getPlaceholder().css('cursor', prevCursor);
            plot.pan({ left: prevPageX - e.pageX,
                       top: prevPageY - e.pageY });
        }
        
        function bindEvents(plot, eventHolder) {
            var o = plot.getOptions();
            if (o.zoom.interactive) {
                eventHolder[o.zoom.trigger](onZoomClick);
                eventHolder.mousewheel(onMouseWheel);
            }

            if (o.pan.interactive) {
                eventHolder.bind("dragstart", { distance: 10 }, onDragStart);
                eventHolder.bind("drag", onDrag);
                eventHolder.bind("dragend", onDragEnd);
            }
        }

        plot.zoomOut = function (args) {
            if (!args)
                args = {};
            
            if (!args.amount)
                args.amount = plot.getOptions().zoom.amount

            args.amount = 1 / args.amount;
            plot.zoom(args);
        }
        
        plot.zoom = function (args) {
            if (!args)
                args = {};
            
            var c = args.center,
                amount = args.amount || plot.getOptions().zoom.amount,
                w = plot.width(), h = plot.height();

            if (!c)
                c = { left: w / 2, top: h / 2 };
                
            var xf = c.left / w,
                yf = c.top / h,
                minmax = {
                    x: {
                        min: c.left - xf * w / amount,
                        max: c.left + (1 - xf) * w / amount
                    },
                    y: {
                        min: c.top - yf * h / amount,
                        max: c.top + (1 - yf) * h / amount
                    }
                };

            $.each(plot.getAxes(), function(_, axis) {
                var opts = axis.options,
                    min = minmax[axis.direction].min,
                    max = minmax[axis.direction].max,
                    zr = opts.zoomRange;

                if (zr === false) // no zooming on this axis
                    return;
                    
                min = axis.c2p(min);
                max = axis.c2p(max);
                if (min > max) {
                    // make sure min < max
                    var tmp = min;
                    min = max;
                    max = tmp;
                }

                var range = max - min;
                if (zr &&
                    ((zr[0] != null && range < zr[0]) ||
                     (zr[1] != null && range > zr[1])))
                    return;
            
                opts.min = min;
                opts.max = max;
            });
            
            plot.setupGrid();
            plot.draw();
            
            if (!args.preventEvent)
                plot.getPlaceholder().trigger("plotzoom", [ plot ]);
        }

        plot.pan = function (args) {
            var delta = {
                x: +args.left,
                y: +args.top
            };

            if (isNaN(delta.x))
                delta.x = 0;
            if (isNaN(delta.y))
                delta.y = 0;

            $.each(plot.getAxes(), function (_, axis) {
                var opts = axis.options,
                    min, max, d = delta[axis.direction];

                min = axis.c2p(axis.p2c(axis.min) + d),
                max = axis.c2p(axis.p2c(axis.max) + d);

                var pr = opts.panRange;
                if (pr === false) // no panning on this axis
                    return;
                
                if (pr) {
                    // check whether we hit the wall
                    if (pr[0] != null && pr[0] > min) {
                        d = pr[0] - min;
                        min += d;
                        max += d;
                    }
                    
                    if (pr[1] != null && pr[1] < max) {
                        d = pr[1] - max;
                        min += d;
                        max += d;
                    }
                }
                
                opts.min = min;
                opts.max = max;
            });
            
            plot.setupGrid();
            plot.draw();
            
            if (!args.preventEvent)
                plot.getPlaceholder().trigger("plotpan", [ plot ]);
        }

        function shutdown(plot, eventHolder) {
            eventHolder.unbind(plot.getOptions().zoom.trigger, onZoomClick);
            eventHolder.unbind("mousewheel", onMouseWheel);
            eventHolder.unbind("dragstart", onDragStart);
            eventHolder.unbind("drag", onDrag);
            eventHolder.unbind("dragend", onDragEnd);
            if (panTimeout)
                clearTimeout(panTimeout);
        }
        
        plot.hooks.bindEvents.push(bindEvents);
        plot.hooks.shutdown.push(shutdown);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'navigate',
        version: '1.3'
    });
})(jQuery);
