var updateData = function() {
  console.log('TorClients: Updating data');
  HTTP.get(Settings.dataUrl, function(error, result) {
    if (error) { console.log(error); }
    if (result && result.statusCode !== 200) { console.log(result.statusCode); }

    TorData.remove({});

    var csv = result.content;
    var parsed = Baby.parse(csv, { dynamicTyping: true, header: true });
    var rows = parsed.data;
    var maxDate = moment(0);

    _.each(rows, function(row) {
      row.date = moment(row.date);
      if (row.date.isAfter(maxDate)) { maxDate = row.date; }
    });

    var endDate = moment(maxDate);
    var startDate = endDate.clone().subtract(Settings.windowLength).subtract(1, 'day');

    _.each(rows, function(row) {
      // We don't want the most recent day because the data is yucky.
      // .isBetween() is exclusive, so it takes care of it for us.
      if (!row.date.isBetween(startDate, endDate, 'day')) { return; }
      if (!row.country) { return; }
      row.date = row.date.toDate();
      TorData.insert(row);
    });
    console.log('TorClients: Data update complete');
  });
};

var maxDateInDB = function() {
  var pipeline = [ { $group: { _id: null, max: { $max: "$date" } } } ];
  var date = TorData.aggregate(pipeline)[0].max;
  return date;
};

if (TorData.find().count() === 0
    || moment(maxDateInDB()).add(Settings.dataOldAfter).isBefore(moment())) {
  updateData();
} else {
  console.log('TorClients: Not updating data - most recent from ' +
      moment(maxDateInDB()).format('YYYY-MM-DD'));
}
Meteor.setInterval(updateData, Settings.updateEvery.asMilliseconds());

Meteor.publish('tor_data', function(countryCode) {
  return TorData.find({ country: countryCode });
});

Meteor.publish('tor_countries', function() {
  var self = this;
  var pipeline = [
    { $group: { _id: '$country' } },
    { $sort: { _id: 1 } }
  ];
  var codes = _.pluck(TorData.aggregate(pipeline), '_id');

  _.each(codes, function(code) {
    var countryName = CountryCodes.countryName(code.toUpperCase());
    if (!countryName) { return; }
    self.added('tor_countries', code, { name: countryName, code: code });
  });

  self.ready();
});
