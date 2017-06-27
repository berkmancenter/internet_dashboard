import { ACCountryProfiles } from '../main.js';
import { _ } from 'meteor/underscore';

const Settings = {
  oldAfter: 48 * 60 * 60 * 1000, // 48 hour in ms
  baseURL: 'https://core.thenetmonitor.org'
};

Meteor.methods({
  'getAccessData':function(url){
    this.unblock();
    var obj = {};
    try{
      var result = HTTP.call('GET', Settings.baseURL + '/statuses', { params: { url: url } });
      obj.isOK = true;
      obj.data = result.data.data;
    }
    catch(e){
      obj.isOK = false;
    }
    return obj;
  },
  getCountries: function() {
    this.unblock();
    const profiles = ACCountryProfiles.find({}).fetch();
    const needsFetch = _.isUndefined(profiles) || profiles.length < 1 ||
      _.max(_.pluck(profiles, 'lastFetched')) + Settings.oldAfter < Date.now();
    if (!needsFetch) { return _.pluck(profiles, 'country_code'); }
    console.log('AccessCheck Data: Fetching countries');
    var result = HTTP.call('GET', Settings.baseURL + '/country_profiles');
    var obj = result.data;
    obj.forEach((countryCode) => {
      CountryInfo.byCode(countryCode, (country) => {
        ACCountryProfiles.upsert({ country_code: countryCode },
            { $set: { country_code: countryCode, name: country.name }});
      });
    });
    return obj;
  },
  getCountryProfile: function(countryCode) {
    this.unblock();
    const profile = ACCountryProfiles.findOne({ country_code: countryCode });
    const needsFetch = _.isUndefined(profile) || _.isUndefined(profile.lastFetched) ||
      profile.lastFetched.valueOf() + Settings.oldAfter < Date.now();
    if (!needsFetch) { return profile; }
    console.log(`AccessCheck Data: Fetching country profile ${countryCode}`);
    var result = HTTP.call('GET', Settings.baseURL + '/country_profiles/' + countryCode);
    var obj = ACCountryProfiles.simpleSchema().clean(result.data);
    obj.lastFetched = Date.now();
    ACCountryProfiles.upsert({ country_code: countryCode }, { $set: obj });
    return obj;
  }
});


