Widget Quick Start Guide
========================

Overview
--------

The dashboard is built on the Meteor platform. Widgets are provided by Meteor packages.

Package Format
--------------

The package format is pretty simple; the only requirement is a folder with a `package.js` file inside. The `package.js` format is also fairly simple:

```javascript
Package.describe({
  name: 'example-widget', // the name of the package in lowercased and with no spaces
  version: '0.0.1', // the current version of this widget package
  git: '', // URL to the git repository containing the source code for this package (optional)
});

Package.onUse(function(api) {
  // Include this line as-is,
  // it matches the version of meteor we're using
  api.versionsFrom('1.1.0.2');

  // State this packages dependencies. Packages can be included on the client, the server, or both.

  // Always include the 'widget' package as both a client and server dependency.
  // Use 'mongo' on both if you want to persist stuff to the DB
  api.use(['widget', 'mongo', 'underscore']);

  // Always include 'templating' as a client dependency.
  api.use(['templating'], 'client');

  // There are no required server dependencies. Include whatever you need.
  api.use(['momentjs:moment'], 'server');


  // Add files in this directory to the package. Package files can be included on the client, the server, or both.
  api.addFiles(['example-widget.js']); // Include these files on both client and server
  api.addFiles(['server/publications.js'], 'server'); // Include these files on the server.
  api.addFiles(['client/widget.html'], 'client'); // Include these files on the client.

  // Export an object from this package that the dashboard will use as the interface to this widget.
  // The export name becomes the "short code" for your widget.
  api.export('Example');
});

// Npm packages can be included (on the server only) with Npm.depends.
// Use the package with Npm.require('package-name').
Npm.depends({
  'package-name': '0.4.6'
});
```

Exported Object
---------------

The object your package exports may have the following properties:
* __widget.name__: the title of the widget as you want it to appear in the dashboard
* __widget.description__: a paragraph-length description of the widget
* __widget.url__: a URL users can visit to learn more about the data backing the widget
* __widget.dimensions.width__: the width of your widget in number of columns
* __widget.dimensions.height__: the height of your widget in number of rows
* __widget.resize.mode__: *optional* - `scale` (default), `reflow`, or `cover`
* __widget.resize.constraints.width.min__: *optional* - the minimum width of your widget in number of columns
* __widget.resize.constraints.width.max__: *optional* - the maximum width of your widget in number of columns
* __widget.resize.constraints.height.min__: *optional* - the minimum height of your widget in number of rows
* __widget.resize.constraints.height.max__: *optional* - the maximum height of your widget in number of rows
* __widget.category__: *optional* - the type of data this widget is showing: `access`, `activity`, or `control`
* __widget.constructor__: the function to be called when a new widget instance is to be created
* __widget.country: *optional* - how many countries the widget displays or compares at once: `single`, or `multi`.
* __widget.countries: *optional* - which countries the widget can be set to display: `all` if it can display all countries available through `imon-data`, an array of alpha-2 or alpha-3 country codes, or 'CountryInfo' if it can display all countries in the `country-info` package.
* __widget.indicators: *optional* - which Internet Monitor indicators from `imon-data` the widget can be set to display: `all`, an array of indicator admin names, or a string with the `displayClass` used to filter indicators (for example, `speed` or `percent`).
* __org.name__: the official name of the organization contributing this widget
* __org.shortName__: a short name to be used in space-constrained use cases
* __org.url__: a URL to the organization

Here's what the object might look like:
```javascript
Example = {
  widget: {
    name: 'Example Widget',
    description: 'This widget is just an example of what a widget might look like.',
    url: 'http://example.com/data',
    dimensions: { width: 2, height: 1 },
    resize: { mode: 'scale', constraints: { width: { min: 2, max: 3 } } },
    category: 'access',
    constructor: ExampleWidget,
    countries: ['afg', 'usa', 'mex'],
    country: 'single'
    indicators: ['speedkbps']
  },
  org: {
    name: 'Example Industries, LLC',
    shortName: 'Example',
    url: 'http://example.com'
  }
};
```

The Widget Object
-----------------

The widget object you create should use the `Widget` object's prototype as its prototype.

You'll also want to call the Widget object's constructor ahead of your own constructor.

The Widget object has one attribute that you can overwrite and manipulate:
* __data__: the widget's data, which will be persisted to the database and used as the HTML template context

Putting it all together looks like this:

```javascript
ExampleWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    countryCode: 'CA',
    countryName: 'Canada'
  });

  /* Other widget code */
};

ExampleWidget.prototype = Object.create(Widget.prototype);
ExampleWidget.prototype.constructor = ExampleWidget;
```

To ensure your widget data gets persisted correctly, your widget has a `set` method, which you should call whenever you want to save your widget's data. Like this:

```javascript
widgetInstance.set({
  countryCode: 'US',
  countryName: 'United States'
});
```

### Integrating with Global Country Setting

The dashboard provides users the ability to set a country across a number of widgets at once where relevant. If you create a widget that has a geographic component to it, you should integrate with this feature. If you do not implement `setCountry`, users will not be able to select your widget when choosing the widgets to alter.

All it takes to achieve this integration is to provide a `setCountry` method on your widget that takes an ISO 3166-1 alpha-2 country code and performs whatever operations are necessary to show the relevant info.

The dashboard also provides a `country-info` package that can help resolve country codes to broader country information like language, region, continent, currency, etc. You can add it by adding `country-info` as a package dependency. See the `country-info` package's source for hints on how to use it.

An example of providing `setCountry`:

```javascript
ExampleWidget.prototype.setCountry = function(countryCode) {
  var widget = this;
  CountryInfo.byCode(countryCode, function(country) {
    widget.data.set({ country: { code: country.code, name: country.name } });
  });
};
```

HTML Templates
--------------

Your widget package can include three different templates:
* a widget template: used to render the widget (required)
* a settings template: used to render a settings popup for the widget (optional)
* an info template: used to render an informational popup for the widget (optional)

To create templates, simply include templates in your package with following naming convention:
* For the widget: `{short code}Widget`, e.g. "ExampleWidget"
* For the settings popup: `{short code}Settings`, e.g. "ExampleSettings"
* For the info popup: `{short code}Info`, e.g. "ExampleInfo"

As a reminder, the "short code" is the name of the object your package exports.

To close the settings popup from a template's event handler (if the user has clicked a save button, for example), call `template.closeSettings()` where `template` is the template instance.

For CSS, all your widgets will receive a class with the same name as your widget package (__not__ the name of your widget's export), e.g. `.example-widget`. Any custom info or settings popup you create will receive the same class with the popup type appended, e.g. `.example-widget-info` or `.example-widget-settings`. Scope all CSS you write within these classes to prevent clashes with other widgets.

Adding the Widget
-----------------

Once you've built your widget, you'll want to add it to the dashboard:

1. Move your widget package to the correct directory. Create a directory under `packages` with the same name you gave your package in `package.js`. Put all your code in it.
2. Add your package to Meteor. At the root of the project, type `meteor add {your package name}`.
3. Add your package to the list of widgets. Open `widgets.js` and add your package name to the top of the array. (Widgets are arranged by when they were added in a descending order)
4. That's it. Start Meteor with `meteor`.

More Information
----------------

The Meteor model relies pretty heavily on subscriptions. The dashboard does not do anything special to handle widget subscriptions - you're on your own to manage any subscriptions you use in your widget.

This is just a quick-start primer. For more on writing Meteor packages, visit http://docs.meteor.com/#/full/writingpackages, and for more on Meteor in general, visit http://docs.meteor.com/#/full/.
