Template.BroadbandCostWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('imon_data_v2', Template.currentData().country.code, Settings.indicatorIds, true);
    template.subscribe('imon_indicators_v2');
  });
});

Template.BroadbandCostWidget.helpers({
  speed: function() {
    var match = this.name.match(Settings.speedRegex)[0];
    if (match === Settings.maxSpeed) {
      match = '>' + match;
    }
    return match;
  },
  percentValue: function(code) {
    var val = getValue(code, this);
    return val.toFixed(1) + '%';
  },
  dataValue: function(code){
    return getValue(code, this) === -1 ? false : true;
  },
  indicators: function() {
    return IMonIndicators.find({ adminName: {$in: Settings.indicatorIds}  });
  },
  cellColor: function(code) {
    var dataValue = getValue(code, this);

    if (dataValue===-1) {
      return 'active';
    }

    var keys = _.keys(Settings.lowerCellClassBounds).sort(function(a, b){
      return parseInt(b, 10) - parseInt(a, 10);
    });
    var key;
    for(var i=0; i<keys.length; i++){
      if(dataValue>=parseInt(keys[i])){
        key = keys[i];
        break;
      }
    }
    return Settings.lowerCellClassBounds[key];
  }
});

function getValue(code, context){
  var record = IMonRecent.findOne({ countryCode: code, indAdminName: context.adminName });
  return _.isUndefined(record) ? -1 : record.value;
}
