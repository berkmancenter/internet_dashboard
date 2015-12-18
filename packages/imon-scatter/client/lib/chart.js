var helpers = d3.compose.helpers;
var mixins = d3.compose.mixins;

Mixed = helpers.mixin(d3.chart('Chart'), mixins.XY, mixins.Series,
    mixins.StandardLayer, mixins.Transition, mixins.LabelsXY);

Mixed.extend('Dots', {
  initialize: function(options) {
    Mixed.prototype.initialize.call(this, options);
    this.colorScale = d3.scale.category20();
    var base = this.base.append('g').attr('class', 'chart-dots');
    this.standardSeriesLayer('Dots', base);
    this.attachLabels();
  },
  itemStyle: helpers.di(function(chart, d, i) {
    return 'fill: ' + chart.colorScale(d.code);
  }),
  onDataBind: function(selection, data) {
    return selection.selectAll('circle')
      .data(data, this.key);
  },
  onInsert: helpers.di(function(chart, selection) {
    return selection.append('circle')
      .on('mouseenter', this.showLabel);
  }),
  onEnter: function(selection) {
    selection
      .attr('r', this.r)
      .attr('cx', this.x)
      .attr('cy', this.y)
      .attr('style', this.itemStyle);
  },
  onMergeTransition: function(selection) {
    this.setupTransition(selection);
    selection
      .attr('cx', this.x)
      .attr('cy', this.y);
  },
  onExitTransition: function(selection) {
    this.setupTransition(selection);
    selection
      .attr('r', 0)
      .remove();
  },

  showLabel: helpers.di(function(chart, d, i) {
    var labels = chart.base.selectAll('g.chart-series').selectAll('g');
    labels.each(function(e, j) {
      d3.select(this).classed('visible-label', d === e);
    });
  }),
  rValue: helpers.property({
    default_value: 4
  }),
  r: helpers.di(function(chart, d, i) {
    return chart.rValue();
  }),
  key: function(d, i) {
    return d.code;
  }
});
