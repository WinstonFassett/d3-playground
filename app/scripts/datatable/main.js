define(['knockout', './DataTable', 'chart/lineChart', 'd3', 'nv', 'chart/stream_layers'], 
	function(ko, DataTable, lineChart, d3, nv, stream_layers){

	console.log(arguments)
console.log('got lineChart', { lineChart: lineChart})	

d3.csv('scripts/data/data.csv', function(err, csv){
	// console.log('got csv', data);
	// var cols = Object.keys(data[0]).map(function(property){
	// 	return {
	// 		id: property,
	// 		label: property
	// 	}
	// })
  
	var testSeries = ['Peter','Paul','Mary']; 
	var genData = stream_layers(testSeries.length,10,50);
	var firstArray = genData[0];
	var testRows = firstArray.map(function(it, i){
		return { };
	});
	testRows.forEach(function(row){
		testSeries.forEach(function(col, i){
			var colValues = genData[i];
			colValues.forEach(function(val, i){
				testRows[i][col] = val.y;
			});
			// row[col] = val.y;
		})
	});
	console.log('testRows', testRows);
	console.log('testSeries', testSeries);
	//.map(function(data, i) {});
	
	var data = testRows;
	// var data = csv;

	var cols = Object.keys(data[0]).map(function(property){
		return {
			id: property,
			label: property
		}
	})

	var dt = DataTable({
		cols: cols,
		rows: data
	});

	dt.xAxisLabel = ko.observable('Time (min)');
	dt.yAxisLabel = ko.observable('Length (in)');	

  // dt.data = ko.observableArray();

  var chart =  nv.models.lineChart(); //lineChart();		
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  chart.xAxis
		// .axisLabel('Time (min)')
  	.tickFormat(function(d){ return d + ' min'});
  // chart.xAxis
      
  //     //.tickFormat(d3.format(',r'));
  chart.yAxis
      // .axisLabel('Length (v)')
      .tickFormat(d3.format('.01f')); 

  var zoom = d3.behavior.zoom()
    .x(chart.xAxis.scale())
    .y(chart.yAxis.scale())
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

	function zoomed() {
		console.log('zoomed', arguments)
	  var x = d3.transition(svg.select('.nv-x.nv-axis'));
	  console.log('x',x);
	  x.call(chart.xAxis);
	  var y = d3.transition(svg.select('.nv-y.nv-axis'))
	  console.log('y', y);
	  y.call(chart.yAxis);
	}

	function reset() {
	  d3.transition().duration(750).tween("zoom", function() {
	    var ix = d3.interpolate(x.domain(), [-width / 2, width / 2]),
	        iy = d3.interpolate(y.domain(), [-height / 2, height / 2]);
	    return function(t) {
	      zoom.x(x.domain(ix(t))).y(y.domain(iy(t)));
	      zoomed();
	    };
	  });
	}


  var selector = 'svg';
  var svg = d3.select(selector)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);
  // todo remove this?
  var svg_ = ko.observable(svg);


  // dt.renderChart = function(){
  // 	console.log('render chart');
		// 	  var svg = d3.select(selector);
	 //      //.datum([]) //for testing noData
	 //      //.datum(data)
	 //  svg
	 //    .transition().duration(500)	     
  // };
  	var axisUpdater = ko.computed(function(){
  		var x = dt.xAxisLabel(),
  				y = dt.yAxisLabel();
			chart.xAxis.axisLabel(x);
			chart.yAxis.axisLabel(y);
			svg_().call(chart);
  	});
	  dt.data = ko.computed({ 
	  	read: function(){
		  	var cols = dt.cols(),
		  			rows = dt.rows(),
		  			svg = svg_();
  			if(rows && cols){
  				var series = cols.map(function(col, colNum){
  					var colId = col.id();
						return {
							key: col.label(),
							values: rows.map(function(it,i){
								var val = it[colId]();
								// console.log('it', it, i, colNum, colId, val);
								return {
									x: i,
									y: val
								}
							})
						};
  				});
  				
  				series = series.concat(sinAndCos()[0]);

  				svg.datum(series)
  						.call(chart);
  						// console.log('setting data', series);
				  // dt.data(series);
  				return series;		
  			}
		  }, 
		  deferEvaluation: true
		}).extend({throttle: 1});

	ko.applyBindings(dt);
});


function sinAndCos(xRange, yFactor) {
  var sin = [],
      cos = [];
      yFactor = yFactor || 40;
  for (var i = 0; i < 100; i++) {
  	var x = i/10;
  	yOffset = yFactor;
    sin.push({x: x, y: /*x % 10 == 5 ? null : */ yOffset + Math.sin(x) * yFactor}); //the nulls are to show how defined works
    cos.push({x: x, y: yOffset + .5 * yFactor * Math.cos(x)});
  }

  return [
    {
      // area: true,
      values: sin,
      key: "Sine Wave"
    },
    {
      values: cos,
      key: "Cosine Wave"
    }
  ];
}


	
});