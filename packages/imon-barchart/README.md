Bar Chart
=========

Purpose
-------
Display a bar chart with customizable x and y axes based on Internet Monitor data (`imon-data`). The current version supports choosing an indicator for the y-axis and a number of countries for the x-axis. The user can also choose whether to display the latest available data per country/indicator or data for a specific year.

Visualization
-------------
This widget uses the `d3compose` package to create a standard bar chart with slight d3 modifications to rotate the labels on the x-axis. The drawing is made of a few steps:

1. Once, when the template is rendered, register the chart/attach it to the DOM node.
2. Whenever drawn/redrawn: set the chart dimensions according to how much space it has in the widget block at the time.
3. Set the indicator name on the top right side of the widget.
4. Set the chart axis titles.
5. Collect the data from the active subscriptions.
6. Handle any errors resulting from missing data and communicate them with the user.
7. If the countries should be sorted by value, sort them.
8. Rotate the x-axis labels by -45 degrees.

All 8 steps/visualization logic can be found in `client/widget.js`

Modes
-----
The bar chart was first designed to handle two modes:
1. Y-axis: Indicator, X-axis: Countries. (Single mode)
2. Y-axis: Country, X-axis: Indicators. (Multi mode)
For the time being, until the Internet Monitor data is divided into comparable groups, the second mode's logic has not yet been implemented, and its settings are hidden in `client/settings.html`.

