Template.WikiEditsWidget.rendered = function() {
  var chart = this.$('.wiki-history').epoch({
    axes: [],
    type: 'time.area',
    data: [ { label: 'Edits', values: [] } ]
  });

  this.autorun(function() {
    var data = WikiEdits.findOne();
    chart.push(data);
    this.$('.wiki-history-count').text(data.y);
  });
};
