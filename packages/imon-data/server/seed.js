var Future = Npm.require('fibers/future');
var Store = Npm.require('jsonapi-datastore').JsonApiDataStore;

function fetchData() {
  console.log('IMonData: [Old API] Fetching...');
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

  console.log('IMonData: [Old API] Inserting...');

  _.each(store.findAll('regions'), insertRegion);
  _.each(store.findAll('countries'), insertCountry);
  _.each(store.findAll('datum_sources'), insertIndicator);
  
  console.log('IMonData: [Old API] Inserted.');

}


function fetchCountries(){
  console.log('IMonData: [Countries] Fetching data..');
  var store = new Store();
  var futures = [];
  var baseUrl = 'https://thenetmonitor.org/v2/countries';

  var fut = HTTP.get.future()(baseUrl, { timeout: Settings.timeout*3 });
  futures.push(fut);
  var results = fut.wait();
  store.sync(results.data);
  _.each(results.data.data, function(d){
    store.sync(d.relationships.data_points);
  });

  console.log('IMonData: [Countries] Data fetched.');
  Future.wait(futures);

  var insert = function(){
    console.log('IMonData: [Countries] Inserting...');
    _.each(store.findAll('countries'), insertCountryData);
    console.log('IMonData: [Countries] Inserted.');
  }

  Future.task(insert);

}

function fetchIndicators(){ // in separate function temporarily.
  console.log('IMonData: [Indicators] Fetching data...');
  var store = new Store();
  var futures = [];
  var baseUrl = 'https://thenetmonitor.org/v2/indicators';

  var fut = HTTP.get.future()(baseUrl, { timeout: Settings.timeout });
  futures.push(fut);
  var results = fut.wait();
  store.sync(results.data);

  console.log('IMonData: [Indicators] Data fetched.');
  Future.wait(futures);

  var insert = function(){
    console.log('IMonData: [Indicators] Inserting..');
    _.each(store.findAll('indicators'), insertIndData);
    console.log('IMonData: [Indicators] Inserted.');
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
    IMonCountriesD.upsert({ code: code }, { $set: country });
  } catch (e) {
    console.error('IMonData: [Old API] Error upserting country data');
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
      IMonDataD.upsert({ countryCode: code, imId: datum.imId }, { $set: datum });
      IMonCountriesD.update({ code: code },
                           { $addToSet: { dataSources: parseInt(i.datum_source.id) }});
    } catch (e) {
      console.error('IMonData: [Old API] Error upserting data');
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
    precision: i.precision
  };

  if ( _.contains(dontShowTheseIndicatorIds,indicator.id)){
    console.log('IMonData: [Old API] Filtering out indicator: ' + indicator.name);
    return;
  }
  
  try {
    console.log('IMonData: [Old API] Upserting indicator:',indicator.name);
    IMonIndicatorsD.upsert({ id: indicator.id }, { $set: indicator });
  } catch (e) {
    console.error('IMonData: [Old API] Error upserting indicator data');
    console.error(e);
    throw e;
  }

}

function insertCountryData(country){
  var code = country.iso3_code.toLowerCase().slice(0,3);
  var dataSources = [];

  var insertDp = function(){
    console.log('IMonData: [Countries] Upserting: ' + country.name);
    _.each(country.data_points, function(dp){
      var d = {
        countryCode: code,
        imId: parseInt(dp.id),
        indAdminName: dp.indicator,
        date: new Date(dp.date),
        value: dp.value
      };
      try{
        IMonData.upsert({ countryCode: code, imId: d.imId }, { $set: d });
      }
      catch(e){
        console.error('IMonData: [Countries] Could not upsert data point '+ d.imId + ' for ' + code);
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
    IMonCountries.upsert({ code: code }, { $set: c });
    console.log('IMonData: [Countries] Upserted: ' + c.name);
  }
  catch(e){
    console.error('IMonData: [Countries] Could not upsert: ' + code);
    console.error(e);
    throw e;
  }
}

function insertIndData(ind){
  var i = {
    id: parseInt(ind.id),
    adminName: ind.admin_name,
    name: ind.name,
    shortName: ind.short_name,
    description: ind.description,
    displayClass: ind.display_class,
    precision: ind.precision,
    inverted: ind.inverted
  }
  try{
    IMonIndicators.upsert({ id: i.id }, { $set: i });
    console.log('IMonData: [Indicators] Upserted: ' + i.adminName);
  }
  catch(e){
    console.error('IMonData: [Indicators] Could not upsert: ' + i.adminName);
    console.error(e);
    throw e;
  }
}


if (Meteor.settings.doJobs) {
  // blow out country data if you want to force an immediate refresh.
    if(IMonCountriesD.find().count() === 0){
    console.log('IMonData: [Old API] Missing data. Let\'s fetch...');
    Future.task(fetchData);
  }
  else {
    console.log('IMonData: [Old API] Already have data.');
  }
  Meteor.setInterval(fetchCountries.future(), Settings.updateEvery);
  if(IMonCountries.find().count() === 0){
    console.log('IMonData: [Countries] Missing data. Let\'s fetch...');
    Future.task(fetchCountries);
  }
  else {
    console.log('IMonData: [Countries] Already have data.');
  }
  Meteor.setInterval(fetchCountries.future(), Settings.updateEvery);

  if(IMonIndicators.find().count() === 0){
    console.log('IMonData: [Indicators] Missing  data. Let\'s fetch...');
    Future.task(fetchIndicators);
  }
  else {
    console.log('IMonData: [Indicators] Already have data.');
  }
  Meteor.setInterval(fetchIndicators.future(), Settings.updateEvery);
}
