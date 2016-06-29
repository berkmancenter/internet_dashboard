
Meteor.publish('imon_indicators', function(indicatorIds){
  var selector = selectIndicators(indicatorIds);
  return IMonIndicators.find(selector);;
  //return IMonIndicators.find();
});

Meteor.publish('imon_countries', function() {
  return IMonCountries.find();
});

Meteor.publish('imon_data', function(countryCode, indicatorIds, idField) {
  var selector = {};
  if (!_.isUndefined(countryCode) && countryCode !== 'all') {
    selector.countryCode = countryCode;
  }
  selectIndicators(indicatorIds,selector,idField);
  return IMonData.find(selector);
});

Meteor.publish('imon_dev', function(countryCode, indicatorIds){ //indicatorIds: Array, countryCode: String
  var selector = {};
  if(_.isUndefined(countryCode) || _.isUndefined(indicatorIds)) { return; }
  if (countryCode !== 'all') {
    selector.countryCode = countryCode;
  }
  if(_.isArray(indicatorIds)){
    selector.indAdminName = { $in: indicatorIds }; 
  }
  return IMonDev.find(selector);
});

Meteor.publish('imon_countries_dev', function(){
  return IMonCountriesDev.find();
});

Meteor.publish('imon_indicators_dev', function(){
  return IMonIndicatorsDev.find({ id: { $nin: [32,33] } }); // all except Herdict & Morningside until there's data for them
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
