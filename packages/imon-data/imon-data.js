Settings = {
  baseUrl: 'https://thenetmonitor.org',
  updateEvery: 1000 * 60 * 60 * 12 * 1,
  timeout: 60 * 1000
};


// NEW API
IMonData = new Mongo.Collection('imon_data_v2');
IMonCountries = new Mongo.Collection('imon_countries_v2');
IMonIndicators = new Mongo.Collection('imon_indicators_v2');
IMonRecent = new Mongo.Collection('imon_recent'); // Same schema as IMonData - 'imId'. Updated on publications, no need to seed.

IMonData.attachSchema(new SimpleSchema({
  countryCode: { type: String, max: 3 },
  imId:        { type: Number },
  indAdminName:{ type: String, optional: true },
  date:        { type: Date, optional: true },
  value:       { type: Number, decimal: true, optional: true }
}));

IMonCountries.attachSchema(new SimpleSchema({
  code:         { type: String, unique: true },
  name:         { type: String },
  dataSources:  { type: [String], defaultValue: [] }
}));

IMonIndicators.attachSchema(new SimpleSchema({
  id:           { type: Number, optional: true },
  name:         { type: String, optional: true },
  shortName:    { type: String, optional: true },
  description:  { type: String, optional: true },
  adminName:    { type: String, unique: true },
  precision:    { type: Number, optional: true },
  displayClass: { type: String, optional: true },
  inverted:     { type: Boolean, optional: true },
  min:          { type: Number, decimal: true, optional: true },
  max:          { type: Number, decimal: true, optional: true }
}));

// OLD API
IMonDataD = new Mongo.Collection('imon_data');
IMonCountriesD = new Mongo.Collection('imon_countries');
IMonIndicatorsD = new Mongo.Collection('imon_indicators');

IMonCountriesD.attachSchema(new SimpleSchema({
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

IMonDataD.attachSchema(new SimpleSchema({
  countryCode: { type: String, max: 3 },
  imId:        { type: Number, unique:true },
  sourceId:    { type: Number },
  startDate:   { type: Date },
  name:        { type: String },
  value:       { type: Number, decimal: true },
  percent:     { type: Number, decimal: true }
}));

IMonIndicatorsD.attachSchema(new SimpleSchema({
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

// SHARED METHODS
IMonMethods = { // For those to work, widget has to be subscribed to imon_indicators_v2
  isAdminName: function(input){
    var test = IMonIndicators.findOne({ adminName: input });
    return !_.isUndefined(test);
  },
  idToAdminName: function(id){
    return IMonIndicators.findOne({ id: id }).adminName;
  }
};