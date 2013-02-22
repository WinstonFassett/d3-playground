

function zoomChart(){


    var margin = {top: 50, right: 10, bottom: 50, left: 70},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    // scales
    var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, width]);
    var y = d3.scale.linear()
        .domain([0, 1])
        .range([height, 0]);
    var radius = 8;
    function chart(selection, options){
      selection.each(function(data, i) {
      // generate chart here; `d` is the data and `this` is the element
        // var svg = d3.select(this)
        if(options){
            margin = options.margin || margin;
            width = options.width || width;
            height = options.height || height;
        }
        console.log('chart', arguments)
        // axes
        var tickPadding = 10;
        var xLabel = "X axis",
            yLabel = "Y axis";
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(-height)
            .tickPadding(tickPadding);
        var yAxis =   d3.svg.axis() // nv.models.axis().axisLabel(yLabel).showMaxMin(false) 
            .scale(y)
            .orient("left")
            .tickSize(-width)
            .tickPadding(tickPadding);
        var line = d3.svg.line()
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); });

        var graphZoom = d3.behavior.zoom().x(x).y(y).scaleExtent([.2, 5]).on("zoom", 
            function(){
                console.log('zooming', d3.event);
                zoom();
            });

        var svg = d3.select(this).selectAll("svg").data([data]);

        var svgEnter = svg.enter()
                .append("svg")
        var gEnter = svgEnter
                .attr("class", "chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(graphZoom)
        
        // build svg
        var current = gEnter;
        // add rect that seems to be required for zoom to work(?)   
        var rect = current.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);
        // add axes
        svg.xAxis = current.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.yAxis = current.append("g")
            .attr("class", "y axis")
            .call(yAxis);
        // add SVG to contain graph so it doesn't overflow
        var graph = current.append("svg") 
            .attr("class", "points")
            .attr("width", width)   
            .attr("height", height) 
            .append("g")    
        // add line
        var linePath = graph.append("path")
            .attr("class", "line")
            .attr("d", line);

        var drag = d3.behavior.drag()

            .on("drag", function(d,i) {
                var dx = x.invert(d3.event.x + d3.event.dx) - x.invert(d3.event.x);
                var dy = y.invert(d3.event.y + d3.event.dy) - y.invert(d3.event.y);
                console.log('drag', dx, dy)
                // d.x += dx;
                d.y += dy;
                zoom();
            });

        var dots = graph.selectAll("circle")
            .append("g")
            .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", radius)
                .attr("transform", translate)
                // .call(d3.behavior.drag().on("drag", function(){
                //     console.log('dragging', d3.event, this)
                // }));
                .on("touchstart", function(){
                    console.log('touchstart', d3.event)
                    // prevents parent pan/zoom event handlers
                    d3.event.stopPropagation();

                })
            .call(drag)
        // svg.yAxis.select('nv-axislabel').attr('x',function(d){return d+10})
        function translate(d) {
            // console.log('translate', d)
          var rtn = "translate(" + x(d.x) + "," + y(d.y) + ")";
          return rtn
        }
        function zoom() {
            svg.xAxis.call(xAxis);
            svg.yAxis.call(yAxis);
            linePath.attr("d", line);
            dots.attr("transform", translate);
        }

      });

    }
  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    x = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    y = _;
    return chart;
  };


    return chart;

}


