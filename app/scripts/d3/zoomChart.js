function zoomChart(opts) {
  opts = opts || {};
  console.log('zoomChart', arguments);
  var margin = opts.margin || {top: 50, right: 10, bottom: 50, left: 70},
      width = opts.width || 960,
      height = opts.height || 500,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; },
      x = opts.x || d3.time.scale(),
      y = opts.y || d3.scale.linear();
      var tickPadding = 10;
      var xLabel = "X axis",
          yLabel = "Y axis";
      var xAxis = //nv.models.axis().axisLabel(xLabel).showMaxMin(false) // 
          d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickSize(-height)
          .tickPadding(tickPadding);
      var yAxis =   //nv.models.axis().axisLabel(yLabel).showMaxMin(false) // 
        d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickSize(-width)
          .tickPadding(tickPadding);
    var
      area = d3.svg.area().x(X).y1(Y),
      line = d3.svg.line().x(X).y(Y);


  function chart(selection, options) {
    // load options
    width = options.width || width;
    height = options.height || height;
    var pRadius = options.pointRadius || 8;
    console.log('chart', arguments);
    selection.each(function(data) {
      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      });
      // Update scales
      x
        .domain(d3.extent(data, function(d) { return d[0]; }))
        .range([0, width - margin.left - margin.right]);
      y
        .domain([0, d3.max(data, function(d) { return d[1]; })])
        .range([height - margin.top - margin.bottom, 0]);
      
      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // define svg 
      var gEnter = svg.enter()
        .append("svg").append("g")
          // .append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	      .call(d3.behavior.zoom().x(x).y(y).scaleExtent([.2, 5]).on("zoom", draw))
      // add rect that seems to be required for zoom to work(?)  
      gEnter.append("rect")
  	    .attr("class", "background")
  	    .attr("width", width)
  	    .attr("height", height);
      // gEnter.append("path").attr("class", "area");

      // add axes
      // gEnter.append("g").attr("class", "x axis");
      gEnter.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
      gEnter.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      var graphEnter = gEnter.append("svg") 
        .attr("class", "points")
        .attr("width", width) 
        .attr("height", height) 
        .append("g") 

      graphEnter.append("path").attr("class", "line");
      // graphEnter.append("g").attr("class", "dots")
      
      var dots = graphEnter.selectAll("circle")
        .append("g")
        .data(function(d){return d})
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", pRadius)
            .attr("transform", translate);

      draw();


      function draw() {
          console.log('draw', d3.event);
          // svg.xAxis.call(xAxis);
          // svg.yAxis.call(yAxis);
          // linePath.attr("d", line);
          // dots.attr("transform", translate);


          // Update the outer dimensions.
          svg .attr("width", width)
              .attr("height", height);

          // Update the inner dimensions.
          var g = svg.select("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          // Update the area path.
          // g.select(".area")
          //     .attr("d", area.y0(y.range()[0]));
          // g.select(".dots").data(data)

          // // Update the line path.
          
          g.select(".line")
            .attr("d", line);
          // g.select('.dots').data(data)
          //   .enter().append("circle")
          //   .attr("class", "dot")
          //   .attr("r", 8)
          //   .attr("transform", translate);;
          //   // // Update the x-axis.
            g.select(".x.axis").call(xAxis);  
            g.select(".y.axis").call(yAxis); 
                // .attr("transform", "translate(0," + y.range()[0] + ")")
                

          dots.attr("transform", translate);   
          dots.attr("r", function(d){return pRadius;});     
      }

    	function translate(d) {
    	  // var rtn = "translate(" + x(d.x) + "," + y(d.y) + ")";
      	  var rtn = "translate(" + (x(d[0])) + "," + (y(d[1])) + ")";
    	  // console.log('translate', rtn);
        return rtn
    	}

    });
  }

  // The x-accessor for the path generator; x âˆ˜ xValue.
  function X(d) {
    return x(d[0]);
  }

  // The x-accessor for the path generator; y âˆ˜ yValue.
  function Y(d) {
    return y(d[1]);
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
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  return chart;
}


