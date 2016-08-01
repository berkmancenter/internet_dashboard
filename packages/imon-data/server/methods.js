Meteor.methods({
	'getIndicatorYears': function(indicatorName){
		var records = IMonData.aggregate([
			{ $match: { indAdminName: indicatorName } },
			{ $sort: { date: 1 } },
			{ $group: { _id: 'indAdminName', years: { $push: { $year: '$date' } } } },
			{ $project: { _id: 0, years: 1 } }
		]);
		return _.uniq(records[0].years);
	}
});