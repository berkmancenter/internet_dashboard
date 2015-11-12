Settings = {
  maxCollectionSpace: 6 * 1024 * 1024, // 6 MB
  maxCollectionNum: 10000 // Number of docs in collection
};

ChangePetitions.attachSchema(new SimpleSchema({
  petitionId: {
    type: String
  },
  latLong: {
    type: Object,
  },
  'latLong.lat': {
    type: Number,
    decimal: true
  },
  'latLong.long': {
    type: Number,
    decimal: true
  },
  fetchedAt: {
    type: Date
  },
}));

ChangePetitions._createCappedCollection(
    Settings.maxCollectionSpace, Settings.maxCollectionNum);


function insertMessage(message) {
  var fetchedAt = new Date(Math.floor(message[1] / 10000));
  var petitions = message[0][0];
  _.each(petitions, function(petition) {
    ChangePetitions.insert({
      latLong: {
        lat: petition.latitude,
        long: petition.longitude
      },
      petitionId: petition.petition_id,
      fetchedAt: fetchedAt
    });
  });
}

if (Meteor.settings.doJobs) {
  var pubnub = Npm.require("pubnub")({
    subscribe_key: Settings.subscribeKey,
    ssl: true,
  });

  pubnub.subscribe({
    channel: Settings.channel,
    callback: insertMessage
  });
}

Meteor.publish('change_petitions', function() {
  return ChangePetitions.find({},
      { limit: Settings.limit, sort: { fetchedAt: -1 } });
});
