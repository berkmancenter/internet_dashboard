Settings = {
  dataUrl: 'https://metrics.torproject.org/stats/clients.csv',
  updateEvery: moment.duration({ days: 1 }),
  windowLength: moment.duration({ days: 60 }),
  dataOldAfter: moment.duration({ days: 5 })
};

if (Meteor.isClient) {
  TorCountries = new Mongo.Collection('tor_countries');
}

TorData = new Meteor.Collection('tor_data');
TorData.attachSchema(new SimpleSchema({
  date: { type: Date },
  node: { type: String },
  country: { type: String },
  clients: { type: Number },
  frac: { type: Number }
}));

TorClientsWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, {
    countryCode: 'us',
    nodeType: 'relay'
  });
};
TorClientsWidget.prototype = Object.create(Widget.prototype);
TorClientsWidget.prototype.constructor = TorClientsWidget;

_.extend(TorClientsWidget.prototype, {
  setCountry: function(countryCode) {
    this.data.set({ countryCode: countryCode.toLowerCase() });
  }
});

TorClients = {
  widget: {
    name: 'Tor Clients',
    description: 'Shows the daily average number of clients connecting to the Tor network from each country',
    url: 'https://metrics.torproject.org/clients-data.html',
    dimensions: { width: 2, height: 1 },
    category: 'access',
    typeIcon: 'line-chart',
    constructor: TorClientsWidget
  },
  org: {
    name: 'The Tor Project, Inc.',
    shortName: 'Tor',
    url: 'https://www.torproject.org/'
  }
};
