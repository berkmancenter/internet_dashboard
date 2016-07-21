Meteor.methods({
	'getData': function(selector, xIndicator, yIndicator, same, zIndicator, xLog, yLog){
	  var years = IMonData.aggregate([
	    { $match: selector },
	    { $group: { _id: '$indAdminName' , date: { $push: { $year: '$date' } } } },
	    { $project: { _id: 0, date: 1 } }
	  ]);

	  years.sort(function(a, b){ return a.date.length < b.date.length ? -1 : a.date.length > b.date.length ? 1 : 0; });
	  var common = intersection(years);

    var hash = {};
    common.forEach(function(year){ hash[year] = []; }); // Initialize hash
    var data;
    var remove = [];
    selector.$where = function(){ return common.indexOf(this.date.getFullYear())!==-1; };

    var records = IMonData.aggregate([
      { $match: selector },
      { $sort:  { date: 1, countryCode: 1, indAdminName: 1 } },
      { $group: { _id: { year: { $year: '$date'}, country: '$countryCode', indAdminName: '$indAdminName' }, value: { $last: '$value' }  } },
      { $group: { _id: { year: '$_id.year', country: '$_id.country' }, values: { $push: { indAdminName: '$_id.indAdminName', value: '$value' } } } },
      { $project: { _id: 0, year: '$_id.year', country: '$_id.country', values: 1 } }
    ]);
    
    records.forEach(function(record){
      // Each record has a year, country, and an array of values
      var xIndex = index(record.values, xIndicator);
      var yIndex = index(record.values, yIndicator);
      if(xIndex === -1 || yIndex === -1){ return; }

      var xValue = record.values[xIndex].value, yValue = record.values[yIndex].value, r;

      if (xLog && xValue > 0) {
        xValue = Math.log(xValue);
      }
      if (yLog && yValue > 0) {
        yValue = Math.log(yValue);
      }

      if(same){
        r = Settings.chart.defaultSize;
      }
      else{
        var zIndex = index(record.values, zIndicator);
        if(zIndex === -1) { return; }
        var sizeIndicator = IMonIndicators.findOne({ adminName: zIndicator});
        var zMax = sizeIndicator.max;
        var sizeVal = record.values[zIndex].value;
        r = ((sizeVal * Settings.chart.maxSize)/zMax) + Settings.chart.minSize;
      }

      var temp = {
        x: xValue,
        y: yValue,
        code: record.country,
        key: record.country,
        label: IMonCountries.findOne({ code: record.country }).name,
        r: r
      };

      hash[record.year].push(temp);
    });

    Object.keys(hash).forEach(function(key){
      if(hash[key].length === 0){ remove.push(common.indexOf(key)); }
    });
    remove.sort(function(a,b){ return a-b; });
    for(var i=remove.length-1; i>=0; i--){
      common.splice(remove[i], 1);
    }  
    return { common: common, hash: hash };
	}
});

function intersection(records){
  var years = records[0].date; // shortest array
  var result = [];
  var count;
  for(var i=0; i<years.length; i++){
    count = 1;
    for(var j=1; j<records.length; j++)
      if(records[j].date.indexOf(years[i]) !== -1) { count++; }
    if(count === records.length && result.indexOf(years[i]) === -1) { result.push(years[i]); } 
  }
  return result.sort(function(a,b){ return a-b; });
}

function index(array, indicator){
  for(var i=0; i<array.length; i++){
    if(array[i].indAdminName===indicator) return i;
  }
  return -1;
}
