Template.AkamaiTraffic2Widget.helpers({
  updatedAt: function() { return CountryTraffic.findOne().updatedAt; }
});

Template.AkamaiTraffic2Widget.onCreated(function() {
  this.subscribe('country_traffic');
});

Template.AkamaiTraffic2Widget.onRendered(function() {
  var template = this;

  this.autorun(function() {
    if (!template.subscriptionsReady()) {
      return;
    }

    var map = new ChoroplethMap();
    var data = {};

    CountryTraffic.find().forEach(function(country){
      data[country.countryCode] = {};
      data[country.countryCode].value = country.percentAboveAverage;
    });
    
    map.draw({
      selector: template.find('.bytes-delivered'),
      dims: { width: 450, height: 250, scale: 98, squash: 0.90, bumpDown: 30, bumpLeft: 0 },
      data: data,
      iso: 3,
      valueSuffix: '%'
    });
  });
});
