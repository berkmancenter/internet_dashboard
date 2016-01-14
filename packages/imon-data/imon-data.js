Settings = {
  baseUrl: 'https://thenetmonitor.org',
  updateEvery: 1000 * 60 * 60 * 24 * 7,
  timeout: 60 * 1000
};

IMonData = new Mongo.Collection('imon_data');
IMonCountries = new Mongo.Collection('imon_countries');

IMonCountries.attachSchema(new SimpleSchema({
  name:        { type: String },
  code:        { type: String, max: 3 },
  iso2Code:    { type: String, max: 2, optional: true },
  rank:        { type: Number, optional: true },
  score:       { type: Number, decimal: true, optional: true },
  accessUrl:   { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
  imageUrl:    { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
  isRegion:    { type: Boolean, defaultValue: false },
  dataSources: { type: [Number], defaultValue: [] }
}));

IMonData.attachSchema(new SimpleSchema({
  countryCode: { type: String, max: 3 },
  imId:        { type: Number },
  sourceId:    { type: Number },
  startDate:   { type: Date },
  name:        { type: String },
  value:       { type: Number, decimal: true },
  percent:     { type: Number, decimal: true }
}));
