
function delegatingObservable(value){
  var ob = ko.observable(value);
  var rtn = ko.computed({
    read: function(){
      var val = ob();
      if(typeof(val)==='function'){
        return val();
      }
      return val;
    }, write: function(val){
      ob(val);
    }
  });   
  return rtn; 
}

ko.bindingHandlers.d3 = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
        console.log('d3 init');
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var unwrap = ko.utils.unwrapObservable;
        var el = d3.select(element);
        var options = unwrap(valueAccessor());
        console.log('d3 update', options);
        if(options.datum){
          var datum = unwrap(options.datum);
          // console.log("datum", datum, options.datum());
          el.datum(datum)

          if(options.chart){
            var chartOptions = ko.toJS(unwrap(options.chart));

            console.log('chartOptions', chartOptions);
            var impl = unwrap(chartOptions.impl);
            if(impl){
              // var chart = impl();
              console.log('calling chart',{ el:el, impl:impl, options:chartOptions});
              el.call(impl, chartOptions)
            }
            
          }   

        }
     
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
    }
};

function koTimeSeriesChart() {


  var newProperty = delegatingObservable;

  var defs = {
    margin: {top: 20, right: 20, bottom: 20, left: 20},
    height: 120,
    width: 760,
    xScale: d3.time.scale(),
    yScale: d3.scale.linear(),
    x: function(d) { return d[0]; },
    y: function(d) { return d[1]; }
  }
  // configuration 
  var margin_ = ko.observable(defs.margin),
      width_ = ko.observable(defs.width),
      height_ = ko.observable(defs.height),
      xValue_ = ko.observable(defs.x),
      yValue_ = ko.observable(defs.y),
      xScale_ = ko.observable(defs.xScale),
      yScale_ = ko.observable(defs.yScale),
      xAxis = d3.svg.axis()
        .scale(defs.xScale)
        .orient("bottom")
        .tickSize(6, 0),
      area = d3.svg.area().x(X).y1(Y),
      line = d3.svg.line().x(X).y(Y);

  // draw the chart.  
  // does not return anything.
  function chart(selection) {
    console.log('chart', arguments);
    // put computed thingy here?
    var xValue = xValue_(),
        yValue = yValue_(),
        xScale = xScale_(),
        yScale = yScale_(),
        width = width_(),
        height = height_(),
        margin = margin_()
        ;

    selection.each(function(data) {

      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      });

      // Update the x-scale.
      xScale
          .domain(d3.extent(data, function(d) { return d[0]; }))
          .range([0, width - margin.left - margin.right]);

      // Update the y-scale.
      yScale
          .domain([0, d3.max(data, function(d) { return d[1]; })])
          .range([height - margin.top - margin.bottom, 0]);

      // Select the svg element, if it exists.
      var el = d3.select(this);
      var svg = el; //.select("svg");.data([data]);
      console.log('got svg', el)
      // if(!svg)
      // {
      //   svg = el.
      // }

      
      // Otherwise, create the skeletal chart.
      var gEnter = svg.data([data]).enter().append("svg").append("g");
      gEnter.append("path").attr("class", "area");
      gEnter.append("path").attr("class", "line");
      gEnter.append("g").attr("class", "x axis");

      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Update the area path.
      var f = area.y0(yScale.range()[0]); //console.log('f',f)
      g.select(".area")
          .attr("d", f);

      // Update the line path.
      g.select(".line")
          .attr("d", line);

      // Update the x-axis.
      g.select(".x.axis")
          .attr("transform", "translate(0," + yScale.range()[0] + ")")
          .call(xAxis);
    });
  }

  // The x-accessor for the path generator; xScale âˆ˜ xValue.
  function X(d) {
    return xScale_()(d[0]);
  }

  // The x-accessor for the path generator; yScale âˆ˜ yValue.
  function Y(d) {
    return yScale_()(d[1]);
  }

  chart.margin = margin_;
  chart.width = width_;
  chart.height = height_
  chart.x = xValue_;
  chart.y = yValue_;


  return chart;
}


