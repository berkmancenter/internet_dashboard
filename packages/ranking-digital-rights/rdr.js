Settings = {
  categories: [ 'Mobile broadband', 'Fixed broadband', 'Social network & blog',
    'IM & calls', 'Search', 'Mail service', 'Video/photo' ],
  defaultCategory: 'Mobile broadband',
  metrics: [
    { name: 'Commitment', abbrev: 'Cmt' },
    { name: 'Freedom of expression', abbrev: 'FoE' },
    { name: 'Privacy', abbrev: 'Pri' },
    { name: 'Total', abbrev: 'Total' }
  ],
  totalMetric: 'Total',
  sortMetric: 'Total',
  pie: {
    background: '#eee',
    radius: 40,
    totalRadius: 40,
    innerRadius: 13
  }
};

RDRData = new Mongo.Collection('ranking_digital_rights');
RDRData.attachSchema(new SimpleSchema({
  category: { type: String },
  company: { type: String },
  metrics: { type: [Object] },
  'metrics.$.name': { type: String },
  'metrics.$.value': { type: Number, decimal: true },
  'metrics.$.rank': { type: Number }
}));

RDRWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, {
    category: Settings.defaultCategory,
    sortMetric: Settings.sortMetric
  });
};
RDRWidget.prototype = Object.create(Widget.prototype);
RDRWidget.prototype.constructor = RDRWidget;

RDR = {
  widget: {
    name: 'Corporate Accountability Index',
    description: 'Ranks Internet and telecommunications companies on their practices around freedom of expression and privacy',
    url: 'https://rankingdigitalrights.org/index2015/download/',
    dimensions: { width: 2, height: 3 },
    resize: {
      constraints: { width: { min: 2 }, height: { min: 2 }},
      mode: 'reflow'
    },
    category: 'control',
    typeIcon: 'pie-chart',
    constructor: RDRWidget
  },
  org: {
    name: 'Ranking Digital Rights',
    shortName: 'Ranking Digital Rights',
    url: 'https://rankingdigitalrights.org/index2015/'
  }
};
