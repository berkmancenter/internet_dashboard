var Future = Npm.require('fibers/future');
var Store = Npm.require('jsonapi-datastore').JsonApiDataStore;

function fetchData() {
  console.log('IMonData: Fetching...');
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

function fetchDev(){
  console.log('IMonDev: Fetching...');
  var store = new Store();
  var futures = [];
  var baseUrl = 'https://imon.dev.berkmancenter.org/v2/';

  var fut = HTTP.get.future()(baseUrl + 'countries', { timeout: Settings.timeout*3 });
  futures.push(fut);
  var results = fut.wait();
  store.sync(results.data);
  _.each(results.data.data, function(d){
    store.sync(d.relationships.data_points);
  });

  console.log('IMonDev: Country data fetched.');
  Future.wait(futures);

  var insert = function(){
    console.log('IMonDev: Inserting...');
    _.each(store.findAll('countries'), insertDevData);
    console.log('IMonDev: Inserted.');
  }

  Future.task(insert);

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
    displayClass:  i.display_class,
    precision: i.precision,
    adminName: i.admin_name
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


// temp, for dev purposes/trying out new api
function insertDevData(country){
  var code = country.iso3_code.toLowerCase().slice(0,3);
  var dataSources = [];

  var insertDp = function(){
    console.log('IMonDev: Upserting country: ' + country.name);
    _.each(country.data_points, function(dp){
      var d = {
        countryCode: code,
        imId: parseInt(dp.id),
        indAdminName: dp.indicator,
        date: new Date(dp.date),
        value: dp.value
      };
      try{
        IMonDev.upsert({ countryCode: code, imId: d.imId }, { $set: d });
      }
      catch(e){
        console.error('IMonDev: Could not upsert data point for ' + code);
        console.error(e);
        throw e;
      }
      dataSources.push(d.indAdminName);
    });
  };
  
  Future.wait(Future.task(insertDp));

  var c = {
    code: code,
    name: country.name,
    dataSources: dataSources
  };

  try{
    IMonCountriesDev.upsert({ code: code }, { $set: c });
    console.log('IMonDev: Upserted country: ' + c.name);
  }
  catch(e){
    console.error('IMonDev: Could not upsert country: ' + code);
    console.error(e);
    throw e;
  }
}
// end temp.

if (Meteor.settings.doJobs) {
  // blow out country data if you want to force an immediate refresh.
  if (IMonCountries.find().count() === 0) {
    console.log('IMonData: No country data. That\'s our cue to fetch...');
    Future.task(fetchData);
  } else {
    console.log('IMonData: We already have data. Not fetching until next interval.');
  }
  Meteor.setInterval(fetchData.future(), Settings.updateEvery);

  if(IMonCountriesDev.find().count() === 0){
    console.log('IMonDev: Missing country dev data. Let\'s fetch...');
    Future.task(fetchDev);
  }
  else {
    console.log('IMonDev: Already have data.');
  }
  Meteor.setInterval(fetchDev.future(), Settings.updateEvery);
}
