import { Widget } from 'meteor/widget';
import { CountryInfo } from 'meteor/country-info';

ThemeInCountryWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    country: { code: 'SA', name: 'Saudi Arabia' }
  });
};

ThemeInCountryWidget.prototype = Object.create(Widget.prototype);
ThemeInCountryWidget.prototype.constructor = ThemeInCountryWidget;

ThemeInCountryWidget.prototype.setCountry = function(countryCode) {
  var widget = this;
  CountryInfo.byCode(countryCode, function(country) {
    widget.data.set({ country: { code: country.code, name: country.name } });
  });
};

ThemeInCountry = {
  widget: {
    name: 'Content Filtering',
    description: 'Shows the filtering status of various content themes in a given country.',
    url: 'https://thenetmonitor.org/',
    dimensions: { width: 3, height: 1 },
    resize: { mode: 'reflow' },
    category: 'control',
    typeIcon: 'sliders',
    constructor: ThemeInCountryWidget,
    countries: 'all',
    country: 'single',
    settings: 'change country'
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'http://thenetmonitor.org'
  }
};
