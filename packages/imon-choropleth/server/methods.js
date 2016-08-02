Meteor.methods({
	getChoroplethData: function(indicatorName){
		var data = IMonData.aggregate([
		    { $match: { indAdminName: indicatorName } },
		    { $sort: { countryCode: 1, date: -1 } },
		    { $group: { _id: { countryCode: '$countryCode', date: { $year: '$date'} }, value: { $first: '$value' } } },
		    { $group: { _id: '$_id.date', records: { $push: { country: '$_id.countryCode', value: '$value' } } } },
		    { $project: { _id: 0, records: 1,  year: '$_id' } }
		]).sort(function(a,b){ return a.year < b.year ? -1 : a.year > b.year ? 1 : 0; });
		return data;
	}
});
