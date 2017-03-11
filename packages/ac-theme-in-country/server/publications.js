import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { CountryProfile } from 'meteor/accesscheck-data';

Meteor.publish('themeInCountry.countryProfile', function(countryCode) {
  new SimpleSchema({
    countryCode: {type: String}
  }).validate({ countryCode });

  Meteor.call('getCountryProfile', countryCode, (err, result) => {
    if (!result.isOK || err) {
      throw new Meteor.Error('country-profile-fail',
          `Failed to fetch country profile for ${countryCode}`);
    }

    this.added('profiles', countryCode,
        _.pick(result.data, ['country_code', 'name', 'themes', 'theme_statuses']));
    this.ready();
  });
});
