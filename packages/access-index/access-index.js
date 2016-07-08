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


AccessIndex = {
  widget: {
    name: 'IM Access Index',
    description: 'Shows the Internet Monitor Access rank and score for countries',
    url: 'https://thenetmonitor.org/faq/a-hackable-access-index',
    dimensions: { width: 2, height: 2 },
    category: 'access',
    typeIcon: 'list',
    constructor: AccessWidget
  },
  org: {
    name: 'Internet Monitor',
    shortName: 'IM',
    url: 'https://thenetmonitor.org'
  }
};
