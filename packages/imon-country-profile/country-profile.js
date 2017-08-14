Settings = {
  defaultCountry: { name: 'United States', code: 'usa' }
};

ImonCountryProfileWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, { country: Settings.defaultCountry });
};

ImonCountryProfileWidget.prototype = Object.create(Widget.prototype);
ImonCountryProfileWidget.prototype.constructor = ImonCountryProfileWidget;

_.extend(ImonCountryProfileWidget.prototype, {
  setCountry: function(countryCode) {
    var widget = this;
    CountryInfo.byCode(countryCode, function(country) {
      var code = country.alpha3.toLowerCase();
      var country = IMonCountries.findOne({ code: code });
      if (country) {
        widget.data.set({ country: country });
      }
    });
  },

  getIndicatorValue: function(indicator) {
    var selector = {
      countryCode: this.data.country.code,
      indAdminName: indicator
    };
    const i = IMonRecent.findOne(selector, { sort: { date: -1 }});
    if (i) { return i.value; } else { return undefined; }
  }
});

ImonCountryProfile = {
  widget: {
    name: 'IM Country Profile',
    description: "Shows the Internet Monitor's profile for a given country",
    url: 'https://thenetmonitor.org/faq/a-hackable-access-index',
    dimensions: { width: 4, height: 2 },
    typeIcon: 'list',
    constructor: ImonCountryProfileWidget,
    country: 'single',
    resize: { mode: 'reflow' },
    countries: ['afg','dza','ago','aus','aut','aze','bgd','blr','bel','ben','bol','bra','bgr','bfa','khm','can','chl','chn','col','cze','dnk','dom','ecu','egy','slv','eth','fin','fra','deu','gha','grc','gtm','hti','hnd','hkg','hun','ind','idn','irn','isr','ita','civ','jpn','jor','ken','kgz','lao','mdg','mys','mli','mex','mar','npl','nld','nic','nga','pak','pry','per','phl','pol','prt','rus','sau','sen','srb','sgp','svk','svn','zaf','kor','esp','lka','sdn','swe','che','syr','twn','tjk','tza','tha','tun','uga','ukr','are','gbr','usa','uzb','ven','vnm','yem','zmb'],
    settings: 'change country'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'https://thenetmonitor.org'
  }
};
