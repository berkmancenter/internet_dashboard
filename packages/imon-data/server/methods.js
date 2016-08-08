Meteor.methods({
	'getIndicatorYears': function(indicatorName){
		var selector = {};
		selector.indAdminName = _.isArray(indicatorName) ? { $in: indicatorName } : indicatorName;
		var records = IMonData.aggregate([
			{ $match: selector },
			{ $sort: { date: 1 } },
			{ $group: { _id: '$indAdminName', years: { $push: { $year: '$date' } } } },
			{ $project: { _id: 0, years: 1 } }
		]);
		records.sort(function(a, b){ return a.years.length < b.years.length ? -1 : a.years.length > b.years.length ? 1 : 0; });
		return intersection(records);
	},
	'hasData': function(countryCode, indicatorName){
		var selector = { countryCode: countryCode };
		if(indicatorName !== 'any-indicators'){ selector.indAdminName = indicatorName; }
		return !_.isUndefined(IMonData.findOne(selector));
	}
});

function intersection(records){
  var years = records[0].years; // shortest array
  var result = [];
  var count;
  for(var i=0; i<years.length; i++){
    count = 1;
    for(var j=1; j<records.length; j++)
      if(records[j].years.indexOf(years[i]) !== -1) { count++; }
    if(count === records.length && result.indexOf(years[i]) === -1) { result.push(years[i]); } 
  }
  return result.sort(function(a,b){ return a-b; });
}
