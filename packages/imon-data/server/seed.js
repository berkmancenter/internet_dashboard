var Future = Npm.require('fibers/future');

function fetchData() {
  console.log('IMonData: Fetching...');
  var Store = Npm.require('jsonapi-datastore').JsonApiDataStore;
  var store = new Store();

  var baseUrl = 'https://thenetmonitor.org/v1/';
  
  var futures = [];

  ['datum_sources', 'countries', 'regions'].forEach(function(type) {
    var fut = HTTP.get.future()(baseUrl + type, { timeout: Settings.timeout });
    futures.push(fut);
    var results = fut.wait();
    store.sync(results.data);
  });

  Future.wait(futures);

  console.log('IMonData: Inserting...');

  _.each(store.findAll('regions'), insertRegion);
  _.each(store.findAll('countries'), insertCountry);
  _.each(store.findAll('datum_sources'), insertIndicator);
  
  console.log('IMonData: Inserted.');
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
function insertCountry(c) {
  insertArea(c, false);
}
function insertRegion(r) {
  insertArea(r, true);
}

function insertArea(a, isRegion) {
  isRegion = isRegion || false;
  var code = a.iso3_code.toLowerCase().slice(0, 3);

  var country = {
    name: a.name,
    code: code,
    rank: a.rank,
    score: a.score,
    isRegion: isRegion,
    dataSources: []
  };

  if (!isRegion) {
    _.extend(country, {
      iso2Code: a.iso_code.toLowerCase(),
      accessUrl: accessUrl(code),
      imageUrl: imageUrl(code)
    });
  }

  try {
    IMonCountries.upsert({ code: code }, { $set: country });
  } catch (e) {
    console.error('IMonData: Error upserting country data');
    console.error(e);
    throw e;
  }
  
  _.each(a.indicators, function(i) {
    // it's confusing that the individual data points are called indicators
    var datum = {
      countryCode: code,
      imId: parseInt(i.id),
      sourceId: parseInt(i.datum_source.id),
      startDate: new Date(i.start_date),
      name: i.datum_source.public_name,
      value: i.original_value,
      percent: i.value
    };

    try {
      IMonData.upsert({ countryCode: code, imId: datum.imId }, { $set: datum });
      IMonCountries.update({ code: code },
                           { $addToSet: { dataSources: parseInt(i.datum_source.id) }});
    } catch (e) {
      console.error('IMonData: Error upserting data');
      console.error(e);
      throw e;
    }
  });
}

function isUrl(url){
  return new SimpleSchema({ url: {type: String, regEx: SimpleSchema.RegEx.Url}}).validate({url: url})
}

function insertIndicator(i){
  var dontShowTheseIndicatorIds = [32,33]; // temporary.
  var sourceUrl = 'https://thenetmonitor.org/sources/platform-data';
  // toss anything after a period. Hack for embedded ITU notification.
  var sourceName = i.source_name.split(".")[0]; 
  
  // source links sometimes have other crap in front of the url.
  //if (i.source_link) {
  //  var link = i.source_link.replace(/^.*http/,"http");
  //  if ( isUrl(link)){
  ///    sourceUrl = source_link;
  //  }
  //}

  var indicator = {
    id: parseInt(i.id),
    name: i.public_name,
    shortName: i.short_name ? i.short_name : i.public_name,
    sourceName: sourceName,
    sourceUrl: sourceUrl,
    description: i.description,
    min: i.min,
    max: i.max,
    displayPrefix: i.display_prefix,
    displaySuffix: i.display_suffix,
    displayClass:  i.display_class
  };

  if ( _.contains(dontShowTheseIndicatorIds,indicator.id)){
    console.log('IMonData: Filtering out indicator: ' + indicator.name);
    return;
  }
  
  try {
    console.log('IMonData: Upserting indicator:',indicator.name);
    IMonIndicators.upsert({ id: indicator.id }, { $set: indicator });
  } catch (e) {
    console.error('IMonData: Error upserting indicator data');
    console.error(e);
    throw e;
  }

}

if (Meteor.settings.doJobs) {
  // blow out country data if you want to force an immediate refresh.
  if (IMonCountries.find().count() === 0) {
    console.log('IMonData: No country data. That\'s our cue to fetch...');
    Future.task(fetchData);
  } else {
    console.log('IMonData: We already have data. Not fetching until next interval.');
  }
  Meteor.setInterval(fetchData.future(), Settings.updateEvery);
}
