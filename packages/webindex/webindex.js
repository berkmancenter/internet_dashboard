WebIndexData = new Mongo.Collection('webindex_data');

Settings = {
  downloadInterval: moment.duration({ minutes: 15 }).asMilliseconds(),
  feedUrl: 'http://thewebindex.org/wp-content/uploads/2012/05/Web_Index_JSON_data_20141.js',
  limit: 10,
  map: {
    width: 450,
    height: 270,
    scale: 110,
    squash: 0.90,
    bumpDown: 30,
    bumpLeft: 30
  }
};

WebIndexWidget = function(doc) { Widget.call(this, doc); };
WebIndexWidget.prototype = Object.create(Widget.prototype);
WebIndexWidget.prototype.constructor = WebIndexWidget;

WebIndex = {
  widget: {
    name: 'Web Index',
    description: 'Shows measures of the Web’s contribution to social, economic and political progress in countries across the world.',
    url: 'http://thewebindex.org/data/',
    dimensions: { width: 3, height: 2 },
    category: 'access',
    typeIcon: 'globe',
    constructor: WebIndexWidget
  },
  org: {
    name: 'World Wide Web Foundation',
    shortName: 'Web Index',
    url: 'http://thewebindex.org/'
  },
  metrics: [
      {name: 'Web Index',            id: 'INDEX'},
      {name: 'Empowerment',      id: 'EMPOWERMENT'},
      {name: 'Political impact', id: 'POLITICAL_IMPACT'},
      {name: 'Economic impact', id: 'ECONOMIC_IMPACT'},
      {name: 'Social and environmental impact', id: 'SOCIAL_AND_ENVIRONMENTAL_IMPACT'},
      {name: 'Relevant content and use', id: 'RELEVANT_CONTENT_AND_USE'},
      {name: 'Freedom and openness', id: 'FREEDOM_AND_OPENNESS'},
      {name: 'Universal access', id: 'UNIVERSAL_ACCESS'},
      {name: 'Education and awareness', id: 'EDUCATION_AND_AWARENESS'},
      {name: 'Access and affordability', id: 'ACCESS_AND_AFFORDABILITY'},
      {name: 'Communications infrastructure', id: 'COMMUNICATIONS_INFRASTRUCTURE'}
    ]
};

WebIndex.defaultMetric=WebIndex.metrics[0];
