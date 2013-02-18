function zoomChart(opts) {
  opts = opts || {};
  console.log('zoomChart', arguments);
  var margin = opts.margin || {top: 50, right: 10, bottom: 50, left: 70},
      width = opts.width || 960,
      height = opts.height || 500,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; },
      x = opts.x || d3.time.scale(),
      y = opts.y || d3.scale.linear(),
      xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(6, 0),
      area = d3.svg.area().x(X).y1(Y),
      line = d3.svg.line().x(X).y(Y);



  function chart(selection, options) {

    width = options.width || width;
    height = options.height || height;

    console.log('chart', arguments);
    selection.each(function(data) {

      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      });

      // Update the x-scale.
      x
          .domain(d3.extent(data, function(d) { return d[0]; }))
          .range([0, width - margin.left - margin.right]);

      // Update the y-scale.
      y
          .domain([0, d3.max(data, function(d) { return d[1]; })])
          .range([height - margin.top - margin.bottom, 0]);

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter()
        .append("svg").append("g");
      
      // gEnter.append("path").attr("class", "area");
      gEnter.append("path").attr("class", "line");
      // gEnter.append("g").attr("class", "x axis");

function translate(d) {
  var rtn = "translate(" + x(d.x) + "," + y(d.y) + ")";
  return rtn
}


      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Update the area path.
      // g.select(".area")
      //     .attr("d", area.y0(y.range()[0]));
      g.selectAll("circle")
	    .append("g")
	    .data(data)
	        .enter().append("circle")
	        .attr("class", "dot")
	        .attr("r", 8)
	        .attr("transform", translate);
      // // Update the line path.
      g.select(".line")
          .attr("d", line);

      // // Update the x-axis.
      // g.select(".x.axis")
      //     .attr("transform", "translate(0," + y.range()[0] + ")")
      //     .call(xAxis);
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


