Settings = {
  indicatorNames: [
    'Broadband subscription charge as a percentage of GDP per capita PPP (0-1 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>1-4 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>4-10 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>10-25 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>25 Mbps)',
  ],
  indicatorIds: ['bbcost1', 'bbcost2', 'bbcost3', 'bbcost4', 'bbcost5'],
  speedRegex: /(\d+-)?\d+ Mbps/,
  maxSpeed: '25 Mbps',
  lowerCellClassBounds: { 66: 'danger', 33: 'warning', 0: 'success' },
  defaultData: {
   country: { name: 'United States', code: 'usa' },
   byYear: false,
   chosenYear: ''
 }
};

BroadbandCostWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, Settings.defaultData);
};

BroadbandCostWidget.prototype = Object.create(Widget.prototype);
BroadbandCostWidget.prototype.constructor = BroadbandCostWidget;

_.extend(BroadbandCostWidget.prototype, {
  setCountry: function(countryCode) {
    var widget = this;
    CountryInfo.byCode(countryCode, function(country) {
      var code = country.alpha3.toLowerCase();
      var country = IMonCountries.findOne({ code: code });
      if (country) {
        widget.data.set({ country: country });
      }
    });
  }
});

BroadbandCost = {
  widget: {
    name: 'Broadband Cost',
    description: 'Shows the cost of broadband access, as a proportion of per capita income, across five tiers based on download speed',
    url: 'https://thenetmonitor.org/sources#bbprice',
    dimensions: { width: 3, height: 1 },
    resize: { mode: 'reflow',
              constraints: { height: { min: 1, max: 1 }, width: { min: 2 } } },
    category: 'access',
    typeIcon: 'table',
    constructor: BroadbandCostWidget
  },
  org: {
    name: 'Google Policy by the Numbers and Communications Chambers',
    shortName: 'Google',
    url: 'http://policybythenumbers.blogspot.com/'
  }
};
