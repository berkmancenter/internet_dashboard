Herdict = {
  displayName: 'Herdict',
  description: 'Recent reports from Herdict',
  referenceUrl: 'http://herdict.org',
  constructor: HerdictWidget
};

HerdictWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 2,
    height: 1
  });

  _.defaults(this.data, {
    country: {
      code: 'US',
      name: 'United States'
    },
    category: 'Internet Tools'
  });

  /* Other widget code */
};

HerdictWidget.prototype = Object.create(Widget.prototype);
HerdictWidget.prototype.constructor = HerdictWidget;
