ChangePetitions = new Mongo.Collection('change_petitions');

Settings = {
  subscribeKey: 'sub-c-b19ef43c-f7ff-11e4-b945-0619f8945a4f',
  channel: 'production_signatures',
  limit: 50,
  map: {
    spots: {
      startColor: '#337ab7',
      stableColor: '#337ab7',
      startSize: 5,
      stableSize: 1.7,
      startOpacity: 1,
      stableOpacity: 0.7,
      ttl: 120,
      fadeDuration: 2000,
      delay: 15.0 / 100,
      jitter: 500,
      pendingMax: 100
    },
    fill: 'rgba(186,186,186,0.8)',
    width: 450,
    height: 270,
    scale: 110,
    squash: 0.90,
    bumpDown: 30,
    bumpLeft: 30
  }
};

ChangeOrgWidget = function(doc) { Widget.call(this, doc); };
ChangeOrgWidget.prototype = Object.create(Widget.prototype);
ChangeOrgWidget.prototype.constructor = ChangeOrgWidget;

ChangeOrg = {
  org: {
    name: 'Change.org',
    shortName: 'Change.org',
    url: 'https://www.change.org/'
  },
  widget: {
    name: 'Change.org',
    description: 'Shows a real-time map of signatures on Change.org petitions',
    url: 'https://www.change.org/impact',
    dimensions: { width: 3, height: 2 },
    category: 'activity',
    typeIcon: 'globe',
    constructor: ChangeOrgWidget,
    country: 'multi',
    countries: 'all'
  }
};
