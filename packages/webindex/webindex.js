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
    {name: 'Web Index',            id: 'INDEX', level: 0},
    {name: 'Empowerment',      id: 'EMPOWERMENT', level: 1},
    {name: 'Political impact', id: 'POLITICAL_IMPACT', level: 2},
    {name: 'Economic impact', id: 'ECONOMIC_IMPACT', level: 2},
    {name: 'Social and environmental impact', id: 'SOCIAL_AND_ENVIRONMENTAL_IMPACT', level: 2},
    {name: 'Relevant content and use', id: 'RELEVANT_CONTENT_AND_USE', level: 1},
    {name: 'Freedom and openness', id: 'FREEDOM_AND_OPENNESS', level: 1},
    {name: 'Universal access', id: 'UNIVERSAL_ACCESS', level: 1},
    {name: 'Education and awareness', id: 'EDUCATION_AND_AWARENESS', level: 2},
    {name: 'Access and affordability', id: 'ACCESS_AND_AFFORDABILITY', level: 2},
    {name: 'Communications infrastructure', id: 'COMMUNICATIONS_INFRASTRUCTURE', level: 2}
  ]
};

WebIndex.defaultMetric=WebIndex.metrics[0];
