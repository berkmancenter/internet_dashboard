LumenCounts = new Mongo.Collection('lumen_counts');
LumenCounts.attachSchema(new SimpleSchema({
  start: { type: Date },
  end: { type: Date },
  urlCount: { type: Number },
  noticeCount: { type: Number }
}));

Settings = {
  binWidth: moment.duration({ days: 1 }),
  numBins: 30,
  perPage: 25,
  countUrls: false
};
Settings.updateEvery = Settings.binWidth;

LumenWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {});
};

LumenWidget.prototype = Object.create(Widget.prototype);
LumenWidget.prototype.constructor = LumenWidget;

Lumen = {
  widget: {
    name: 'Takedown Requests',
    description: 'Shows the number takedown requests Chilling Effects has received over time',
    url: 'https://www.chillingeffects.org/',
    dimensions: { width: 2, height: 1 },
    constructor: LumenWidget,
  },
  org: {
    name: 'Chilling Effects',
    shortName: 'Chilling Effects',
    url: 'https://www.chillingeffects.org/',
  }
};
