var helpers = d3.compose.helpers;
var mixins = d3.compose.mixins;

Settings = {
  chart: {
    padding: { right: 40, bottom: 80 },
    margins: { top: 30, bottom: 0, right: 35 },
    dots: {
      size: 5,
      color: '#378E00',
      opacity: 0.7
    }
  }
};

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
    return 'fill: ' + Settings.chart.dots.color + '; ' +
           'opacity: ' + Settings.chart.dots.opacity + ';';
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
      .attr('cx', this.xJit)
      .attr('cy', this.yJit)
      .attr('style', this.itemStyle);
  },
  onMergeTransition: function(selection) {
    this.setupTransition(selection);
    selection
      .attr('cx', this.xJit)
      .attr('cy', this.yJit);
  },
  onExitTransition: function(selection) {
    this.setupTransition(selection);
    selection
      .attr('r', 0)
      .remove();
  },

  showLabel: helpers.di(function(chart, d, i) {
    var circles = chart.base.selectAll('g.chart-dots circle');
    circles.each(function(e, j) {
      d3.select(this).classed('selected', d === e);
    });

    var labels = chart.base.selectAll('g.chart-labels g.chart-label');
    labels.each(function(e, j) {
      d3.select(this).classed('visible-label', d === e);
    });
  }),
  rValue: helpers.property({
    default_value: Settings.chart.dots.size
  }),
  xJitter: helpers.property({
    default_value: 0
  }),
  yJitter: helpers.property({
    default_value: 0
  }),
  xJit: helpers.di(function(chart, d, i) {
    return chart.x(d, i) + _.random(-1 * chart.xJitter(), chart.xJitter());
  }),
  yJit: helpers.di(function(chart, d, i) {
    return chart.y(d, i) + _.random(-1 * chart.yJitter(), chart.yJitter());
  }),
  r: helpers.di(function(chart, d, i) {
    return chart.rValue();
  }),
  key: function(d, i) {
    return d.code;
  }
});
