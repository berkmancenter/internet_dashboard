var Future = Npm.require('fibers/future');

var updateData = function() {
  console.log('TorClients: Fetching data');
  var options = {
    timeout: 10 * 1000
  };
  HTTP.get(Settings.dataUrl, options, function(error, result) {
    if (error) { console.error(error); return; }
    if (result && result.statusCode !== 200) {
      console.error(result.statusCode);
      return;
    }

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
    console.log('TorClients: Fetched data');
  });
};

var maxDateInDB = function() {
  var pipeline = [ { $group: { _id: null, max: { $max: "$date" } } } ];
  var date = TorData.aggregate(pipeline)[0].max;
  return date;
};

if (Meteor.settings.doJobs) {
  if (TorData.find().count() === 0 ||
      moment(maxDateInDB()).add(Settings.dataOldAfter).isBefore(moment())) {
    Future.task(updateData);
  } else {
    console.log('TorClients: Not updating data - most recent from ' +
        moment(maxDateInDB()).format('YYYY-MM-DD'));
  }
  Meteor.setInterval(updateData.future(), Settings.updateEvery.asMilliseconds());
}

Meteor.publish('tor_data', function(countryCode) {
  return TorData.find({ country: countryCode.toLowerCase() });
});

Meteor.publish('tor_countries', function() {
  var self = this;
  var pipeline = [
    { $group: { _id: '$country' } },
    { $sort: { _id: 1 } }
  ];
  var codes = _.pluck(TorData.aggregate(pipeline), '_id');

  _.each(codes, function(code) {
    var country = _.findWhere(CountryInfo.countries,
        { code: code.toUpperCase() });
    if (!country) { return; }
    self.added('tor_countries', code, country);
  });

  self.ready();
});
