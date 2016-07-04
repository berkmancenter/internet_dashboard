
Meteor.methods({
	rankData: function(){
		var old = Assets.getText('rankData.csv');
		var rows = old.split("\n");
		var IMonOld = {};
		for(var i=0; i<rows.length; i++){
			var tmp = rows[i].split(',');
			var code = tmp[0].toLowerCase();
			var name = tmp[1];
			var score = parseFloat(tmp[2]);
			var rank = parseInt(tmp[3]);
			IMonOld[code] = {code: code, rank: rank, score: score, name: name};
		}
		return IMonOld;
	}
});