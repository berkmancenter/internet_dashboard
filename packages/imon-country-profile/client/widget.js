Template.ImonCountryProfileWidget.onCreated(function(){
  var template = this;
  template.autorun(function() {
    template.subscribe('imon_data_v2',
        Template.currentData().country.code,
        ['pop', 'HDIr', 'gdpcapus', 'ipr', 'litrate'],
        true);
  });
});

Template.ImonCountryProfileWidget.onRendered(function() {
});

Template.ImonCountryProfileWidget.helpers({
  percentOnline: function() {
    const val = this.widget.getIndicatorValue('ipr');
    if (_.isUndefined(val)) { return '-'; }
    return val.toFixed(0) + '%';
  },
  literacyRate: function() {
    const val = this.widget.getIndicatorValue('litrate');
    if (_.isUndefined(val)) { return '-'; }
    return val.toFixed(0) + '%';
  },
  hdi: function() {
    const val = this.widget.getIndicatorValue('HDIr');
    if (_.isUndefined(val)) { return '-'; }
    return val.toFixed(0) + ' / 186';
  },
  gdp: function() {
    const val = this.widget.getIndicatorValue('gdpcapus');
    if (_.isUndefined(val)) { return '-'; }
    return val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  },
  population: function() {
    const val = this.widget.getIndicatorValue('pop');
    if (_.isUndefined(val)) { return '-'; }
    return val.toLocaleString();
  },
  country: function() {
    return Template.currentData().country;
  },
  imageUrl: function(code){
    return 'https://thenetmonitor.org/countries/' + code + '/thumb';
  },
});
