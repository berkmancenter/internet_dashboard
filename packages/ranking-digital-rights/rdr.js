Settings = {
  granularities: [ 'Companies', 'Services'],
  defaultGranularity: 'Services',
  categories: [ 'Mobile', 'Fixed broadband', 'Social network & blog',
    'Messaging & VoIP', 'Search', 'Mail service', 'Video/photo' ],
  defaultCategory: 'Mobile',
  metrics: [
    { name: 'Commitment', classes: 'tilted' },
    { name: 'Freedom of expression', classes: 'tilted' },
    { name: 'Privacy', classes: 'tilted' },
    { name: 'Total', classes: 'text-center' }
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
  service: { type: String },
  company: { type: String },
  country: { type: String },
  service_metrics: { type: [Object] },
  'service_metrics.$.name': { type: String },
  'service_metrics.$.value': { type: Number, decimal: true },
  'service_metrics.$.rank': { type: Number },
  company_metrics: { type: [Object] },
  'company_metrics.$.name': { type: String },
  'company_metrics.$.value': { type: Number, decimal: true }
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
    dimensions: { width: 3, height: 4 },
    resize: {
      constraints: { width: { min: 2 }, height: { min: 2 }},
      mode: 'reflow'
    },
    category: 'activity',
    typeIcon: 'pie-chart',
    constructor: RDRWidget
  },
  org: {
    name: 'Ranking Digital Rights',
    shortName: 'Ranking Digital Rights',
    url: 'https://rankingdigitalrights.org/index2015/'
  }
};
