Speedometer
===========

Purpose
-------

A widget that displays values from speed-related indicators from IMon Data across a speedometer, where the maximum value of that speedometer is the maximum recorded data (from that source) for that indicator.

Visualization
--------------

The visualization for this widget is done with "vanilla" d3. Steps:

1. Identify the nodes and attach d3 to the appropriate ones.
2. Calculate the chart's width and height.
3. Get indicator data and data point value for the chosen indicator/country/year(if applicable).
4. Calculate the percentage of the data point value from the maximum recorded value for that indicator.
5. Draw accordingly.

All visualization logic can be found in [client/widget.js](client/widget.js).

