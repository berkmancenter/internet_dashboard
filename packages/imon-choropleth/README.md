Global Choropleth Chart
=======================

Purpose
-------
Display a choropleth chart that represents 1 indicator's values in all countries with the option to animate over years of data.

Visualization
-------------
### Summary

This widget uses the `country-info` package to create a global map (see [country-info](../country-info)) and changes/redraws the values for that chart with data for every year. Steps:

1. Set the indicator in the top right corner and on the chart.
2. Call `getChoroplethData` and use the returned result to draw the initial chart and attach event handlers.

### getChoroplethData(indicatorName)

#### Parameters

- indicatorName: the indicator's admin name.

#### Returns

An array of objects, each object structured as follows:

```javascript
{
	year: 'year for the data',
	records: [
		{ country: 'country code', value: 'data value for that indicator/country/year' }
	]
}
```
If more than one value is found for a specific year/indicator/country, the most recent is returned.

### Animation

There are three controllers:

1. Step Forward/Step Backward: Draw the next or previous year.
2. Play/Pause: Iterate through the years/pause iteration.
3. Loop: Set loop on/off. Can be triggered during an ongoing animation or not.

These controllers rely on Session variables to function. Those Session variables are identified by the widget ID:

1. `ID+'-loop'`: true if loop is on, false or undefined if not.
2. `ID+'-current'`: index of the currently displayed year.
3. `ID+'-array'`: the array returned from `getChoroplethData`.

The initial shapes are drawn only once, then their colors/data are updated with any redraw.
 

