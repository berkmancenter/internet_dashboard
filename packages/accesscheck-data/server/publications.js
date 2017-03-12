import { Meteor } from 'meteor/meteor';
import { ACCountryProfiles } from '../main.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.publish('ac.countryProfile', function(args) {
  new SimpleSchema({
    countryCode: { type: String },
  }).validate(args);

  Meteor.call('getCountryProfile', args.countryCode, (err, result) => {
    if (err) {
      throw new Meteor.Error('country-profile-fail',
          `Failed to fetch country profile for ${args.countryCode}: ${err}`);
    }
  });

  return ACCountryProfiles.find({ country_code: args.countryCode });
});

Meteor.publish('ac.countries', function() {
  Meteor.call('getCountries', (err, result) => {
    if (err) {
      throw new Meteor.Error('countries-fail', `Failed to fetch AC countries: ${err}`);
    }
  });
  return ACCountryProfiles.find({}, { fields: { country_code: 1, name: 1 }});
});

