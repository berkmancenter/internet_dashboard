Template.TorClientsWidget.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('tor_data', Template.currentData().countryCode);
  });
});

Template.TorClientsWidget.helpers({
  countryName: function() {
    var country = _.findWhere(CountryInfo.countries,
        { code: this.countryCode.toUpperCase() });
    return country ? country.name : '';
  }
});

Template.TorClientsWidget.onRendered(function() {
  var template = this;
  template.autorun(function() {
    if (!template.subscriptionsReady()) { return; }

    var $graphNode = template.$('.tor-clients');
    var data = TorData.find({
      country: Template.currentData().countryCode.toLowerCase(),
      node: Template.currentData().nodeType
    }, { sort: { date: 1 } });
    var pnts = data.map(function(d) { return { x: d.date, y: d.clients }; });

    pnts = [ { label: 'Tor Clients', values: pnts } ];

    if (template.graph) {
      template.graph.update(pnts);
    } else {
      template.graph = $graphNode.epoch({
        type: 'line',
        data: pnts,
        axes: ['left', 'bottom'],
        ticks: { left: 3, bottom: 3 },
        tickFormats: { bottom: function(d) { return moment(d).fromNow(); } },
        margins: { left: 40 }
      });
    }
  });
});
