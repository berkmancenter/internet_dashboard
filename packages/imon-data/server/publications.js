
Meteor.publish('imon_indicators', function(indicatorIds){
  var selector = selectIndicators(indicatorIds);
  console.log("REINOS: publishing imon_indicators with selector: " , selector);
  return IMonIndicators.find(selector);;
  //return IMonIndicators.find();
});

Meteor.publish('imon_countries', function() {
  return IMonCountries.find();
});

Meteor.publish('imon_data', function(countryCode, indicatorIds, idField) {
  console.log("REINOS: publishing imon_data with countryCode " + countryCode + " and indicatorIds " , indicatorIds , " and idField " + idField);
  var selector = {};
  if (!_.isUndefined(countryCode) && countryCode !== 'all') {
    selector.countryCode = countryCode;
  }
  selectIndicators(indicatorIds,selector,idField);
  console.log("REINOS: publishing imon_data with selector: ", selector);
  return IMonData.find(selector);
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
