var data = 
// { "key": "howdy" , values: 
d3.range(40).map(function(i) {
  return {x: i / 39, y: (Math.sin(i / 3) + 2) / 4};
})
// };
// define structure
// margin
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
// axes
var tickPadding = 10;
var xLabel = "X axis",
    yLabel = "Y axis";
var xAxis = nv.models.axis().axisLabel(xLabel).showMaxMin(false) // d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height)
    .tickPadding(tickPadding);
var yAxis =   nv.models.axis().axisLabel(yLabel).showMaxMin(false) // d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(-width)
    .tickPadding(tickPadding);


var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

// build svg
var svg = d3.select("body").append("svg")
    .datum(data)
    .attr("class", "chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(d3.behavior.zoom().x(x).y(y).scaleExtent([.2, 5]).on("zoom", zoom))
// add rect that seems to be required for zoom to work(?)   
var rect = svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);
// add axes
svg.xAxis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
svg.yAxis = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
// add SVG to contain graph so it doesn't overflow
svg.graph = svg.append("svg") 
    .attr("class", "points")
    .attr("width", width) 
    .attr("height", height) 
    .append("g")    
// add line
var linePath = svg.graph.append("path")
    .attr("class", "line")
    .attr("d", line);
var dots = svg.graph.selectAll("circle")
    .append("g")
    .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 8)
        .attr("transform", translate);
// svg.yAxis.select('nv-axislabel').attr('x',function(d){return d+10})
function translate(d) {
    console.log('translate', d)
  var rtn = "translate(" + x(d.x) + "," + y(d.y) + ")";
  return rtn
}
function zoom() {
    svg.xAxis.call(xAxis);
    svg.yAxis.call(yAxis);
    linePath.attr("d", line);
    dots.attr("transform", translate);
}