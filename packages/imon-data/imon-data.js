Settings = {
  baseUrl: 'https://thenetmonitor.org',
  updateEvery: 1000 * 60 * 60 * 24 * 7,
  timeout: 60 * 1000
};

IMonData = new Mongo.Collection('imon_data');
IMonCountries = new Mongo.Collection('imon_countries');

IMonCountries.attachSchema(new SimpleSchema({
  name:      { type: String },
  code:      { type: String, max: 3 },
  iso2Code:  { type: String, max: 2 },
  rank:      { type: Number },
  score:     { type: Number, decimal: true },
  accessUrl: { type: String, regEx: SimpleSchema.RegEx.Url },
  imageUrl:  { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
}));

IMonData.attachSchema(new SimpleSchema({
  countryCode: { type: String, max: 3 },
  imId:        { type: Number },
  name:        { type: String },
  value:       { type: Number, decimal: true },
  percent:     { type: Number, decimal: true }
}));
