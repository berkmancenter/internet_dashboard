var binLabel = function(startDate) {
  return moment(startDate).fromNow();
  //Settings.numBins - Math.round((Date.now() - startDate) / Settings.binWidth.asMilliseconds()) - 1;
};

Template.LumenWidget.helpers({
  binWidth: function() { return Settings.binWidth.humanize().replace(/^a /, ''); }
});

Template.LumenWidget.onCreated(function() {
  this.subscribe('lumen_counts');
});

Template.LumenWidget.onRendered(function() {
  var template = this;
  this.autorun(function() {
    if (template.subscriptionsReady()) {
      var urlCounts = [ {
        label: 'URL Counts',
        values: LumenCounts.find().map(function(bin) {
          return { time: bin.start, y: bin.urlCount };
        })
      } ];

      template.$('.url-counts').epoch({
        type: 'time.bar',
        data: urlCounts,
        axes: ['left', 'bottom'],
        ticks: { left: 2, time: Math.round(Settings.numBins / 3) },
        tickFormats: { bottom: function(d) { return moment(d).fromNow(); } },
        margins: { left: 30, top: 10, right: 20 },
        windowSize: Settings.numBins,
        historySize: Settings.numBins
      });
    }
  });
});

