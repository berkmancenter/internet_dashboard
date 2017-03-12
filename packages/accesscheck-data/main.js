import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const ACCountryProfiles = new Mongo.Collection('ac.country_profiles');
ACCountryProfiles.attachSchema(new SimpleSchema({
  "country_code": { type: String },
  "name": { type: String, optional: true },
  "lastFetched": { type: Date, optional: true },
  /*
  "status_code_counts": { type: Object, blackbox: true },
  "mean_timings": { type: Object, blackbox: true },
  "confidence_histograms": { type: Object, blackbox: true },
  "category_confidence_histograms": { type: Object, blackbox: true },
  "down_classifier_counts": { type: Object, blackbox: true },
  */
  "themes": { type: Array, optional: true },
  "themes.$": { type: String },
  "theme_statuses": { type: Array, optional: true },
  "theme_statuses.$": { type: Object, blackbox: true, optional: true },
}));
export { ACCountryProfiles };
