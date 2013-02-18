define(['knockout', 'knockout.wrap'], function(ko, wrap){
	// hack so we can call wrap while debugging in views
	ko.wrap = wrap;

  var unwrap = ko.utils.unwrapObservable,
  		map = ko.utils.arrayMap;

	function Series(data){
	console.log('Series', data);
		var self = wrap.fromJS(data);
		self.toJS = function(){ return wrap.toJS(self); }
		return self;
	}
	
	function DataTable(data){
		console.log('DataTable', data);
		var self = wrap.fromJS(data);

	  // self.series = ko.computed({
	  // 	read:function(){
	  // 		var cols = self.cols(),
	  // 				rows = self.rows()
	  // 				;
			// 	if(cols && rows){
			// 		console.log('creating series');
			// 		var series = map(cols, function(col){
			// 			var colId = col.id(),
			// 			    values = map(rows, function(row){
			// 						return unwrap(row[colId]);
			// 					})
			// 			    ;
			// 			return Series({
			// 				key: colId,
			// 				values: values
			// 			});
			// 		});
			// 		return series;
			// 	}
	  // 	}, 
	  // 	deferEvaluation: true
	  // });
	  self.toJS = function(){ return wrap.toJS(self); }

		return self;
	};

	return DataTable;

});