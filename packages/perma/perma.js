Settings = {
  updateEvery: moment.duration({ minutes: 5 }).asMilliseconds(),
  fetchLimit: 20,
  updateTimestampsEvery: 60 * 1000
};

PermaArchives = new Mongo.Collection('perma_archives');
PermaArchives.attachSchema(new SimpleSchema({
  'creation_timestamp': { type: Date },
  'dark_archived': { type: Boolean },
  'dark_archived_robots_txt_blocked': { type: Boolean },
  'expiration_date': { type: Date },
  'guid': { type: String },
  'organization': { type: String, optional: true },
  'title': { type: String },
  'url': { type: String },
  'thumb_url': { type: String },
  'vested': { type: Boolean },
  'vested_timestamp': { type: Date },
  'view_count': { type: Number },
  'hostname': { type: String },
  'captures': { type: [Object] },
  'captures.content_type': { type: String },
  'captures.$.playback_url': { type: String },
  'captures.$.record_type': { type: String },
  'captures.$.role': { type: String },
  'captures.$.status': { type: String },
  'captures.$.url': { type: String },
  'captures.$.user_upload': { type: Boolean }
}));

PermaWidget = function(doc) {
  Widget.call(this, doc);
};
PermaWidget.prototype = Object.create(Widget.prototype);
PermaWidget.prototype.constructor = PermaWidget;

Perma = {
  widget: {
    name: 'Recent Perma Archives',
    description: 'Shows Perma.cc archives as they are created',
    dimensions: { width: 1, height: 4 },
    resize: { mode: 'reflow' },
    category: 'activity',
    constructor: PermaWidget
  },
  org: {
    name: 'Perma.cc',
    shortName: 'Perma',
    url: 'https://perma.cc'
  }
};
