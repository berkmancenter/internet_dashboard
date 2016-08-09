Timeline
========

Purpose
-------

A widget that can display either:

1. For one indicator, value trends in form of line charts for several countries. ('singleIndicator')
2. For one country, value trends in form of line charts for several indicators (not necessarily comparable in terms of units). ('singleCountry')

The idea is to compare the trends, so in the first scenario, the trend lines are intertwined (when they meet), but in the second, they display after each other on a unified time scale (x-axis).

Visualization
-------------

The widget uses [d3compose](../d3compose) to draw two charts on top of each other - a line chart, to display the trend, and a 'Points' chart, to mark the data points and make it easier to see a value on hover. Labels are titles appended to the points chart instead of attached labels/svg text elements.

### Functions

#### createChartNode(selector, code)

Creates a chart node in a specified place. Used in the one country, multiple indicators mode ('singleCountry').

##### Parameters

- selector: selector for where the node is supposed to be appended.
- code: unique code for this node (in this case, an index value)

##### Returns

Nothing.

#### setDimensions(ch, numberOfCharts, sel, redraw)

##### Parameters

- ch: chart variable (where the chart from d3compose is attached).
- numberOfCharts: how many lines there are in case of singleCountry mode.
- sel: selector for the chart node.
- redraw: if a redraw of the chart is needed (if the chart was already rendered once before).

##### Returns

Nothing.

#### setMultiDimensions(multiCharts)

##### Parameters

- multiCharts: an array of objects structured like this:

```javascript
{ 
	chart: 'the chart variable where d3compose is attached',
	chartNode: 'the element/selector for the chart node',
	labelNode: 'the element/selector for the chart label',
	label: 'the chart label',
	options: 'the chart options for drawing'
}
```

Complete visualization logic can be found in [client/widget.js](client/widget.js).