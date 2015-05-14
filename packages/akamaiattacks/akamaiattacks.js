CountryAttacks = new Mongo.Collection('country_attacks');

Settings = {
  downloadInterval: moment.duration({ minutes: 15 }).asMilliseconds(),
  feedUrl: 'http://wwwnui.akamai.com/gnet/data/attacks_4qErAbuRXsD73D3kcwrLeUreS5AD3E1.xml',
  limit: 10
};

AttacksWidget = function(doc) {
  Widget.call(this, doc);
  _.extend(this, {
    width: 2,
    height: 2
  });
};
AttacksWidget.prototype = Object.create(Widget.prototype);
AttacksWidget.prototype.constructor = AttacksWidget;

AkamaiAttacks = {
  displayName: 'Akamai Attack Monitor',
  description: 'Shows country-level attack information from Akamai',
  referenceUrl: 'http://www.akamai.com/html/technology/real-time-web-metrics.html',
  constructor: AttacksWidget
};
