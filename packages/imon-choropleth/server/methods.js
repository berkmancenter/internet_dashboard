Meteor.methods({
	getChoroplethData: function(indicatorName, recentOnly){
		var IMon = recentOnly ? IMonRecent : IMonData;
		var data = IMon.aggregate([
		    { $match: { indAdminName: indicatorName } },
		    { $sort: { countryCode: 1, date: -1 } },
		    { $group: { _id: { countryCode: '$countryCode', date: { $year: '$date'} }, value: { $first: '$value' } } },
		    { $group: { _id: '$_id.date', records: { $push: { country: '$_id.countryCode', value: '$value' } } } },
		    { $project: { _id: 0, records: 1,  year: '$_id' } }
		]).sort(function(a,b){ return a.year < b.year ? -1 : a.year > b.year ? 1 : 0; });
		return recentOnly ? join(data) : data;
	}
});

function join(arr){
	var temp = [];
	for(var i=arr.length - 1; i>=0; i--){
		for(var j=0; j<arr[i].records.length; j++){
			if(index(temp, arr[i].records[j].country)===-1){ temp.push(arr[i].records[j]); }
		}
	}
	return temp;
}

function index(array, country){
	for(var i=0; i<array.length; i++){
		if(array[i].country === country){ return i; }
	}
	return -1;
}