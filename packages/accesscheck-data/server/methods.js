Meteor.methods({
	'getAccessData':function(url){
		this.unblock();
		var obj = {};
		try{
			var result = HTTP.call('GET', Settings.baseURL + '/statuses', { params: { url: url } });
			obj.isOK = true;
			obj.data = result.data.data;
		}
		catch(e){
			obj.isOK = false;
		}
		return obj;
	},
	getCountryProfile: function(countryCode) {
		this.unblock();
		var obj = {};
		try{
			var result = HTTP.call('GET', Settings.baseURL + '/country_profiles/' + countryCode);
			obj.isOK = true;
			obj.data = result.data;
		}
		catch(e){
			obj.isOK = false;
		}
		return obj;
	}
});


