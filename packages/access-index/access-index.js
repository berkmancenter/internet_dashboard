Settings = {
  numRanks: 7,
  defaultCountry: { name: 'United States', code: 'usa' }
};

AccessWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, { country: Settings.defaultCountry });
};

AccessWidget.prototype = Object.create(Widget.prototype);
AccessWidget.prototype.constructor = AccessIndex;

_.extend(AccessWidget.prototype, {
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

AccessIndex = {
  widget: {
    name: 'IM Access Index',
    description: 'Shows the Internet Monitor Access rank and score for countries',
    url: 'https://thenetmonitor.org/faq/a-hackable-access-index',
    dimensions: { width: 2, height: 2 },
    category: 'access',
    typeIcon: 'list',
    constructor: AccessWidget,
    country: 'single',
    countries: ['afg','dza','ago','aus','aut','aze','bgd','blr','bel','ben','bol','bra','bgr','bfa','khm','can','chl','chn','col','cze','dnk','dom','ecu','egy','slv','eth','fin','fra','deu','gha','grc','gtm','hti','hnd','hkg','hun','ind','idn','irn','isr','ita','civ','jpn','jor','ken','kgz','lao','mdg','mys','mli','mex','mar','npl','nld','nic','nga','pak','pry','per','phl','pol','prt','rus','sau','sen','srb','sgp','svk','svn','zaf','kor','esp','lka','sdn','swe','che','syr','twn','tjk','tza','tha','tun','uga','ukr','are','gbr','usa','uzb','ven','vnm','yem','zmb'] 
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'https://thenetmonitor.org'
  }
};
