WordLists = new Mongo.Collection('mc_wordlists');
WordLists.attachSchema(new SimpleSchema({
  country: { type: Object },
  'country.tagId': { type: Number },
  'country.name': { type: String },
  'country.code': { type: String },
  updated: { type: Date },
  words: { type: Object },
  'words.new': { type: [Object] },
  'words.new.$.term': { type: String },
  'words.new.$.count': { type: Number }
}));

Stories = new Mongo.Collection('mc_stories');
Stories.attachSchema(new SimpleSchema({
  country: { type: Object },
  'country.tagId': { type: Number },
  'country.name': { type: String },
  'country.code': { type: String },
  updated: { type: Date },
  term: { type: String },
  stories: { type: [Object] },
  'stories.$.title': { type: String },
  'stories.$.url': { type: String },
  'stories.$.publish_date': { type: Date },
  'stories.$.media_name': { type: String },
  'stories.$.media_url': { type: String },
  'stories.$.stories_id': { type: Number },
  'stories.$.language': { type: String }
}));
