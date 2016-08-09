d3.compose for Meteor
=====================

Summary
-------
This package is a wrapper for the pre-existing [d3.compose library](https://csnw.github.io/d3.compose/) for use in Meteor. In addition to the standard charts provided by d3.compose, `lib/chart.js` registers two other chart types: Dots and Points.

Dots
----
Create a scatterplot of equally-sized dots with attached labels. Example of attaching a Dots chart to a DOM element:

```javascript
// See d3.compose docs for details on how this works
var chart = d3.select(node).chart('Compose', function(options) {
    var xs = _.pluck(options.data, 'x'), ys = _.pluck(options.data, 'y');

    var scales = {
      x: { domain: [_.min(xs), _.max(xs)] },
      y: { domain: [_.min(ys), _.max(ys)] },
    };

    var charts = [{
      type: 'Dots',
      id: 'dots',
      data: options.data,
      xScale: scales.x,
      yScale: scales.y,
      xJitter: options.xJitter,
      yJitter: options.yJitter,
      labels: {
        offset: 3
      }
    }];

    var title = d3c.title('Custom Chart');
    var xAxis = d3c.axis('xAxis', {scale: scales.x, ticks: 3});
    var yAxis = d3c.axis('yAxis', {scale: scales.y, ticks: 3});
    var xAxisTitle = d3c.axisTitle(options.xAxisTitle);
    var yAxisTitle = d3c.axisTitle(options.yAxisTitle);

    return [
      [yAxisTitle, yAxis, d3c.layered(charts)],
      xAxis,
      xAxisTitle
    ];
  });
```

Points
------
Similar to Dots, with the differnce being the ability to modify the radius (in px) of each individual point by adding an `r` value to individual data points. So a data point could look something like this:

```javascript
{
	x: 20,
	y: 10,
	r: 15
}
```
A default `r` value can also be set by adding it to the charts array as follows:

```javascript
var charts = [{
      type: 'Points',
      id: 'points',
      data: options.data,
      xScale: scales.x,
      yScale: scales.y,
	  rValue: 5
}];

```

Priority is given to the `r` value in a data point. If no such value is given, the radius for that point will be the default specified above. 