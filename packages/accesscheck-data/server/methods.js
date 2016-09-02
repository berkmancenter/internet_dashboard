Meteor.methods({
	'getAccessData':function(url){
		this.unblock();
		var obj = {};
		try{
			var result = HTTP.call('GET', Settings.baseURL + '/statuses', { params: { url: encodeURIComponent(url) } });
			obj.isOK = true;
			obj.data = result.data.data;
		}
		catch(e){
			obj.isOK = false;
		}
		return obj;
	}
});


