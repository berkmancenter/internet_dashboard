Bubble Chart
=========

Purpose
-------
Display a bubble chart that represents 2 or 3 indicators/dimensions of data - x-axis, y-axis, and bubble size (optional) - with the option to animate over years of data.

Visualization
-------------
### Summary

This widget uses the `d3compose` package to create a 'Point' chart (see [d3compose](../d3compose)) and changes/redraws that chart with data for every year. Steps:

1. Once, when the template is rendered, register the chart/attach it to the DOM node.
2. Whenever drawn/redrawn: set the chart dimensions according to how much space it has in the widget block at the time.
3. Set data that doesn't change over the years (axis titles, for example)
4. Call a server method, `getData`, detailed below, to get sanitized data in the form of an object containing the available years to be displayed
5. Attach event handlers and draw the initial chart.

### getData(selector, xIndicator, yIndicator, sameSize, zIndicator, xLog, yLog)

#### Parameters

- selector: selector object for the database (`IMonData`) query.
- xIndicator: admin name of the indicator for the x-axis.
- yIndicator: admin name of the indicator for the y-axis.
- sameSize: boolean. True if all bubbles are the same size.
- zIndicator: admin name of the indicator for the z-axis.
- xLog: boolean. True if the x-axis value is set to be Log(data value)
- yLog: boolean. True if the y-axis value is set to be Log(data value)

#### Returns

```javascript
{ 
	common: 'array. Common years between the indicators, sorted in ascending order',
	hash: 'object. Keys are years found in common, with each value being an array of data points containing x, y, and r values.'
}
```


### Animation

There are three controllers:

1. Step Forward/Step Backward: Draw the next or previous year.
2. Play/Pause: Iterate through the years/pause iteration.
3. Loop: Set loop on/off. Can be triggered during an ongoing animation or not.

These controllers rely on Session variables to function. Those Session variables are identified by the widget ID:

1. `ID+'-loop'`: true if loop is on, false or undefined if not.
2. `ID+'-current'`: index of the currently displayed year.
3. `ID+'-common'`: the array of years returned from `getData`.
4. `ID+'-hash'`: the hash/data values object returned from `getData`.

 

