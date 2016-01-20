WebIndexData = new Mongo.Collection('webindex_data');

//feedUrl: 'http://thewebindex.org/wp-content/uploads/2012/05/Web_Index_JSON_data_20141.js',

Settings = {
  downloadInterval: moment.duration({ minutes: 15 }).asMilliseconds(),
  feedUrl: 'http://localhost:8080/thewebindex/Web_Index_JSON_data_20141.json',  
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
    url: 'http://thewebindex.org/data/?indicator=INDEX&country=ALL',
    dimensions: { width: 3, height: 2 },
    category: 'access',
    typeIcon: 'globe',
    constructor: WebIndexWidget
  },
  org: {
    name: 'The World Wide Web Foundation',
    shortName: 'WWW Foundation',
    url: 'http://thewebindex.org/data/?indicator=INDEX&country=ALL'
  }
};
