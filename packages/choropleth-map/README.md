Choropleth Map
==============

Purpose
-------
Package that visualizes data in the form of a choropleth map. 

There are 2 supported types of maps:
  - One data indicator with various values across countries. In this case, the map has one color with shades corresponding to the represented values. (See: imon-choropleth)
  - Multiple data indicators with optional values. In this case, each indicator will have a different color (for example: red for 'down', blue for 'up') and if ("shade") values are present (numerical, positive values), color strength will vary according to that value. (See: accesscheck-choropleth)

Use
---
- Construct a ChoroplethMap object
```javascript
  var map = new ChoroplethMap();
```
- Draw the map using the available options (ChoroplethMap.prototype.draw):
    - **selector**: selector string or template-level selector (template.find('SELECTOR')) for the (empty) div for the map.
    - **data**: OBJECT with keys = country code (in upper case) and values = data object corresponding to that country. Only has to cover countries with data.
    - **dims**: OBJECT (all fields mentioned in the default are required). DEFAULT: { width: 450, height: 200, scale: 90, squash: 0.90, bumpDown: 30, bumpLeft: 30 }.
    - **iso**:  2 or 3. 2 if the country codes are in ISO 3166-1 alpha-2 format, 3 if in ISO 3166-1 alpha-3. DEFAULT: 2.
    - **colors**: either a STRING (one color [darkest] whose shades correspond to the value of the data in hex format) OR an OBJECT, whose keys are the legend keys, and values are of type STRING representing the color in hex format. DEFAULT: '#08519C' (blue).
    - **noDataColor**: STRING (any color format). DEFAULT: 'rgb(186,186,186)' (gray).
    - **maxNumberOfCells**:  NUMBER > 0. Only include if colors is a string, otherwise the number of label cells = number of keys in colors. DEFAULT: 5.
    - **valueKey**: STRING. The key in the data object that holds the value to be represented on the map. Either numerical (in case colors is a string) or a string corresponding to a legend key (in case colors is an object). DEFAULT: 'value'.
    - **shadeKey**: STRING. Only include if colors is an object AND you want colors to be shaded according to a specific key in the data. For example: the map represents red and blue countries, and you also want it to show a difference between different red countries according to a value in the data. The value must in this case be numerical and must be >=0.
    - **valueSuffix**: STRING. If the value (in case of 1 color) or shadeKey (in case of many colors) represented has a common suffix, include that here.
  
  Example:
```javascript
  var countryData = {
    US: { count: 50 },
    IR: { count: 100 }
  };
  map.draw({
    selector: template.find('.map-place'),
    data: countryData,
    dims: { width: 450, height: 200, scale: 90, squash: 0.90, bumpDown: 30, bumpLeft: 30 },
    iso: 2,
    colors: '#000',
    noDataColor: '#fff',
    maxNumberOfCells: 3,
    valueKey: 'count',
    valueSuffix: 'balloons'
  });
```

- You can also update the drawn map's data (new colors on the same scale) (ChoroplethMap.prototype.update):
  The only available options here are `data`, `valueKey`, `shadeKey`, and `valueSuffix`.

  Example:
  ```javascript
    var newData = {
      US: { count: 200 },
      IR: { count: 20 },
      EG: { count: 50 }
    };
    map.update({
      data: newData,
      valueKey: 'count',
      valueSuffix: 'balloons'
    });
  ```
