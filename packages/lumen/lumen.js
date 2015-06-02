LumenCounts = new Mongo.Collection('lumen_counts');
LumenCounts.attachSchema(new SimpleSchema({
  start: { type: Date },
  end: { type: Date },
  urlCount: { type: Number },
  noticeCount: { type: Number }
}));

Settings = {
  binWidth: moment.duration({ hours: 6 }),
  numBins: 20,
  perPage: 50,
  startPage: 11 // at 50 per page, there are 11 pages of future-dated (messed up) notices
};
Settings.updateEvery = Settings.binWidth;

LumenWidget = function(doc) {
  Widget.call(this, doc);
  _.extend(this, {
    width: 2,
    height: 1
  });

  _.defaults(this.data, {});
};

LumenWidget.prototype = Object.create(Widget.prototype);
LumenWidget.prototype.constructor = LumenWidget;

Lumen = {
  widget: {
    name: 'Takedown Requests',
    description: 'Shows the number takedown requests Chilling Effects has received over time',
    url: 'https://www.chillingeffects.org/',
    constructor: LumenWidget,
  },
  org: {
    name: 'Chilling Effects',
    shortName: 'Chilling Effects',
    url: 'https://www.chillingeffects.org/',
  }
};
