Template.WikiEditsWidget.onCreated(function() {
  var template = this;
  template.WikiBins = new Mongo.Collection('wikibins');

  template.autorun(function() {
    if (template.sub) {
      console.log('stopping sub');
      template.sub.stop();
    }
    console.log('subbing ' + Template.currentData().channel.channel);
    template.sub = template.subscribe(
      'wikiedits_binned',
      Template.currentData().channel.channel,
      Template.currentData().historyLength
    );
  });
});

Template.WikiEditsWidget.onRendered(function() {
  var template = this;

  var chart = this.$('.wiki-history').epoch({
    axes: [],
    windowSize: 20,
    type: 'time.area',
    margins: { top: 0, right: 0, bottom: 0, left: 0 },
    data: [ { label: 'Edits', values: [] } ]
  });

  this.autorun(function() {
    if (template.subscriptionsReady()) {
      var latestBin = template.WikiBins.findOne({}, { sort: { time: -1 } });
      if (!latestBin) {
        return;
      }
      var data = [{ time: latestBin.time.valueOf() / 1000, y: latestBin.count }];
      chart.push(data);
      template.$('.wiki-history-count').text(data[0].y);
    }
  });
});

Template.WikiEditsWidget.helpers({
  historyLength: function() {
    return (this.historyLength / 1000).toString();
  }
});

