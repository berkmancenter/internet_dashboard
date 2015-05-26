Template.WikiEditCountsWidget.onCreated(function() {
  var template = this;

  template.autorun(function() {
    if (template.sub) {
      console.log('stopping sub');
      template.sub.stop();
    }
    console.log('subbing ' + Template.currentData().channel.channel);
    template.sub = template.subscribe(
      'wikiedits_binned',
      Template.currentData().channel.channel,
      Template.currentData().binWidth
    );
  });
});

Template.WikiEditCountsWidget.onRendered(function() {
  var template = this;

  var chart = template.$('.wiki-history').epoch({
    axes: [],
    windowSize: Settings.numBins,
    historySize: Settings.numBins,
    queueSize: 1,
    type: 'time.area',
    margins: { top: 0, right: 0, bottom: 0, left: 0 },
    data: [ { label: 'Edits', values: [] } ]
  });

  template.autorun(function() {
    var bins = BinnedWikiEdits.find({
      channel: Template.currentData().channel.channel,
      binWidth: Template.currentData().binWidth
    }, { sort: ['binStart', 'desc'] });

    bins.observe({ added: function(bin) {
      var data = [{ time: bin.binStart.valueOf() / 1000, y: bin.count }];
      chart.push(data);
      template.$('.wiki-history-count').text(data[0].y);
    }});
  });
});

Template.WikiEditCountsWidget.helpers({
  binWidth: function() {
    return (this.binWidth / 1000).toString();
  }
});
