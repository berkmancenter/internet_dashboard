var granularities = ['Companies (by type)',  'Services (by category)', 'Services (by company)' ];
var categories = [ 'Mobile', 'Fixed broadband', 'Social network & blog', 'Messaging & VoIP', 'Search', 'Mail service', 'Video/photo' ];
var companyTypes = ['internet company','telco'];

Settings = {
  granularities: granularities,
  defaultGranularity: granularities[1],
  categories: categories,
  defaultCategory: categories[0],
  companyTypes: companyTypes,
  COMPANIES_BY_TYPE: granularities[0],
  SERVICES_BY_CATEGORY: granularities[1],
  SERVICES_BY_COMPANY: granularities[2],
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

RDRServiceData = new Mongo.Collection('ranking_digital_rights_services');
RDRServiceData.attachSchema(new SimpleSchema({
  category: { type: String },
  name:     { type: String },
  company:  { type: String },
  country:  { type: String },
  metrics:  { type: [Object] },
  'metrics.$.name': { type: String },
  'metrics.$.value': { type: Number, decimal: true }
}));


RDRCompanyData = new Mongo.Collection('ranking_digital_rights_companies');
RDRCompanyData.attachSchema(new SimpleSchema({
  type:     { type: String },
  name:     { type: String },
  country:  { type: String },
  metrics:  { type: [Object] },
  'metrics.$.name': { type: String },
  'metrics.$.value': { type: Number, decimal: true }
}));

RDRWidget = function(doc) {
  Widget.call(this, doc);
  _.defaults(this.data, {
    category: Settings.defaultCategory,
    granularity: Settings.defaultGranularity,
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
