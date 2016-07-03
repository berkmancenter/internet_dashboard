
Meteor.publish('imon_indicators', function(indicatorIds){
  var selector = selectIndicators(indicatorIds);
  return IMonIndicatorsD.find(selector);;
  //return IMonIndicators.find();
});

Meteor.publish('imon_countries', function() {
  return IMonCountriesD.find();
});

Meteor.publish('imon_data', function(countryCode, indicatorIds, idField) {
  var selector = {};
  if (!_.isUndefined(countryCode) && countryCode !== 'all') {
    selector.countryCode = countryCode;
  }
  selectIndicators(indicatorIds,selector,idField);
  return IMonDataD.find(selector);
});


function selectIndicators(indicatorIds,selector,idField){
  idField = idField === 'name' ? 'name' : 'sourceId';
  selector = selector ? selector : {};
  if (idField === 'id' ){
    numberize(indicatorIds);
  }
  if (_.isArray(indicatorIds)) { selector[idField] = { $in: indicatorIds }; }
  if (_.isString(indicatorIds)) { selector[idField] = indicatorIds; }
  return selector;
}

function numberize(strings){
  if (_.isArray(strings)) { _.each(strings,function(s,i){strings[i]=parseInt(s); }); }
  if (_.isString(strings)) { strings = parseInt(string); }
}

Meteor.publish('imon_data_v2', function(countries, indicators, recentOnly){
  /**
  Countries: either String (one code, or 'all') or array. Type: country code(s).
  Indicators: either String (one code, or 'all') or array. Type: admin name(s).
  recentOnly: boolean (true: only get most recent data, false: also get historical data). Works only if single country & single indicator.
  **/
  var selector = {};
  setSelector(selector, 'countryCode', countries);
  setSelector(selector, 'indAdminName', indicators);
  return recentOnly && _.isString(countries) && _.isString(indicators) ? IMonData.find(selector, { sort: { date: -1 }, limit: 1 }): IMonData.find(selector);
});

function setSelector(selector, fieldName, input){
  if(_.isString(input) && input !== 'all'){
    selector[fieldName] = input;
  }
  else if(_.isArray(input)){
    selector[fieldName] = { $in: input };
  }
}

Meteor.publish('imon_countries_v2', function(){
  return IMonCountries.find();
});

Meteor.publish('imon_indicators_v2', function(){
  return IMonIndicators.find({ id: { $nin: [32,33] } }); // all except Herdict & Morningside until there's data for them
});
