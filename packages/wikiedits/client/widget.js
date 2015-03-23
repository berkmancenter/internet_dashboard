Template.WikiEditsWidget.onCreated(function() {
  this.subscribe('wikiedits_binned');
});

Template.WikiEditsWidget.onRendered(function() {
  var chart = this.$('.wiki-history').epoch({
    axes: [],
    windowSize: 20,
    historySize: 20,
    queueSize: 20,
    type: 'time.area',
    margins: { top: 0, right: 0, bottom: 0, left: 0 },
    data: [ { label: 'Edits', values: [] } ]
  });
  var template = this;

  this.autorun(function() {
    if (template.subscriptionsReady()) {
      var latestBin = EditsOverTime.findOne();
      var data = [{ time: latestBin.time.valueOf() / 1000, y: latestBin.count }];
      chart.push(data);
      template.$('.wiki-history-count').text(data[0].y);
    }
  });
});
