var Future = Npm.require('fibers/future');

function fetchData() {
  console.log('IMon Data: Fetching data');
  var Store = Npm.require('jsonapi-datastore').JsonApiDataStore;
  var store = new Store();
  var sourceUrl = 'https://thenetmonitor.org/v1/datum_sources';
  var countryUrl = 'https://thenetmonitor.org/v1/countries';

  var sourceFuture = HTTP.get.future()(sourceUrl, { timeout: Settings.timeout });
  var countryFuture = HTTP.get.future()(countryUrl, { timeout: Settings.timeout });

  var sourceResults = sourceFuture.wait();
  var countryResults = countryFuture.wait();

  console.log('IMon Data: Inserting data');
  store.sync(sourceResults.data);
  store.sync(countryResults.data);

  _.each(store.findAll('countries'), function(c) {
    var code = c.iso3_code.toLowerCase();

    var country = {
      name: c.name,
      code: code,
      iso2Code: c.iso_code.toLowerCase(),
      rank: c.rank,
      score: c.score,
      accessUrl: accessUrl(code),
      imageUrl: imageUrl(code)
    };

    try {
      IMonCountries.upsert({ code: code }, { $set: country });
    } catch (e) {
      console.error('IMon Data: Error inserting data');
      console.error(e);
      throw e;
    }

    _.each(c.indicators, function(i) {
      var indicator = {
        countryCode: code,
        imId: i.id,
        name: i.datum_source.public_name,
        value: i.original_value,
        percent: i.value
      };

      try {
        IMonData.upsert({ countryCode: code, imId: i.id }, { $set: indicator });
      } catch (e) {
        console.error('IMon Data: Error inserting data');
        console.error(e);
        throw e;
      }
    });
  });
  console.log('IMon Data: Fetched data');
}

function countryUrl(iso3Code) {
  return Settings.baseUrl + '/countries/' + iso3Code;
}
function imageUrl(iso3Code) {
  return countryUrl(iso3Code) + '/thumb';
}
function accessUrl(iso3Code) {
  return countryUrl(iso3Code) + '/access';
}

if (Meteor.settings.doJobs) {
  if (IMonCountries.find().count() === 0) {
    Future.task(fetchData);
  }

  Meteor.setInterval(fetchData.future(), Settings.updateEvery);
}

Meteor.publish('imon_indicators', function() {
  var publication = this;
  var pipeline = { $group: { _id: '$name', name: { $first: '$name' }}};
  var indicators = IMonData.aggregate(pipeline);
  indicators.forEach(function(i) {
    publication.added('imon_indicators', i._id, i);
  });
  publication.ready();
});

Meteor.publish('imon_countries', function() {
  return IMonCountries.find();
});

Meteor.publish('imon_data', function(countryCode, indicators) {
  var selector = {};
  if (!_.isUndefined(countryCode) && countryCode !== 'all') {
    selector.countryCode = countryCode;
  }
  if (_.isArray(indicators)) { selector.name = { $in: indicators }; }
  if (_.isString(indicators)) { selector.name = indicators; }
  return IMonData.find(selector);
});
