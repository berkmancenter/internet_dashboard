Meteor.methods({
	'getData': function(selector, xIndicator, yIndicator, same, zIndicator, xLog, yLog){
	  var records = IMonData.aggregate([
	    { $match: selector },
	    { $group: { _id: '$indAdminName' , date: { $push: { $year: '$date' } } } },
	    { $project: { _id: 0, indAdminName: '$_id', date: 1 } }
	  ]);
	  records.sort(function(a, b){ return a.date.length < b.date.length ? -1 : a.date.length > b.date.length ? 1 : 0; });
	  var common = intersection(records);

    var hash = {};
    var data;
    var remove = [];
    common.forEach(function(year, index){
      data = [];
      IMonCountries.find().forEach(function(country){
        var x = IMonData.findOne({ countryCode: country.code, indAdminName: xIndicator, date: { $gte: new Date(year, 1, 1), $lte: new Date(year, 12, 31) } }, { $sort: { date: 1 } });
        var y = IMonData.findOne({ countryCode: country.code, indAdminName: yIndicator, date: { $gte: new Date(year, 1, 1), $lte: new Date(year, 12, 31) } }, { $sort: { date: 1 } });
        if(_.isUndefined(x) || _.isUndefined(y)) { return; }
        var xValue = x.value, yValue = y.value, r;
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
          var sizeIndicator = IMonIndicators.findOne({ adminName: zIndicator });
          var zMax = sizeIndicator.max;
          var sizeVal = IMonData.findOne({ countryCode: country.code, indAdminName: zIndicator, date: { $gte: new Date(year, 1, 1), $lte: new Date(year, 12, 31) }}, { $sort: { date: 1 } });
          if(_.isUndefined(sizeVal)) { return; }
          r = ((sizeVal.value * Settings.chart.maxSize)/zMax) + Settings.chart.minSize;
        }
        data.push({
          x: xValue,
          y: yValue,
          code: country.code,
          key: country.code,
          label: country.name,
          r: r
        });
      });
      if(data.length>0) hash[year] = data;
      else{ remove.push(index); }
    });
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

function countrySelector(countries){
  return _.isArray(countries) ? { code: { $in: countries } } : {};
}
