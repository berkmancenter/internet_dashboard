Settings = {
  baseUrl: 'https://thenetmonitor.org',
  updateEvery: 1000 * 60 * 60 * 12 * 1,
  timeout: 60 * 1000
};

IMonData = new Mongo.Collection('imon_data');
IMonCountries = new Mongo.Collection('imon_countries');
IMonIndicators = new Mongo.Collection('imon_indicators');
IMonDev = new Mongo.Collection('imon_dev');
IMonCountriesDev = new Mongo.Collection('imon_dev_countries');
IMonIndicatorsDev = new Mongo.Collection('imon_dev_indicators');

IMonCountries.attachSchema(new SimpleSchema({
  name:        { type: String },
  code:        { type: String, max: 3, unique:true },
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
  imId:        { type: Number, unique:true },
  sourceId:    { type: Number },
  startDate:   { type: Date },
  name:        { type: String },
  value:       { type: Number, decimal: true },
  percent:     { type: Number, decimal: true }
}));

IMonIndicators.attachSchema(new SimpleSchema({
  id:            { type: Number, unique: true },
  name:          { type: String, unique: true },
  shortName:     { type: String, optional:true },
  description:   { type: String, optional:true },  
  displaySuffix: { type: String, optional:true },
  precision:     { type: Number, optional: true },
  min:           { type: Number, decimal: true, optional: true },
  max:           { type: Number, decimal: true, optional: true }, 
  sourceName:    { type: String },
  sourceUrl:     { type: String, regEx: SimpleSchema.RegEx.Url, optional: true}
}));

IMonDev.attachSchema(new SimpleSchema({
  countryCode: { type: String, max: 3 },
  imId:        { type: Number },
  indAdminName:{ type: String, optional: true },
  date:        { type: Date, optional: true },
  value:       { type: Number, decimal: true, optional: true }
}));

IMonCountriesDev.attachSchema(new SimpleSchema({
  code:         { type: String, unique: true },
  name:         { type: String },
  dataSources:  { type: [String], defaultValue: [] }
}));

IMonIndicatorsDev.attachSchema(new SimpleSchema({
  id:           { type: Number, unique: true },
  name:         { type: String, unique: true },
  shortName:    { type: String, optional: true },
  description:  { type: String, optional: true },
  adminName:    { type: String, unique: true },
  precision:    { type: Number, optional: true },
  displayClass: { type: String, optional: true }
}));
