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
  api.use(['widget', 'mongo']);

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

The object your package exports must have the following properties:
* __widget.name__: the title of the widget as you want it to appear in the dashboard
* __widget.description__: a paragraph-length description of the widget
* __widget.url__: a URL users can visit to learn more about the data backing the widget
* __widget.constructor__: the function to be called when a new widget instance is to be created
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
    constructor: ExampleWidget
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

The Widget object adds a few attributes that you can overwrite and manipulate:
* __width__: the number of columns the widget should span - either 1, 2 or 3
* __height__: the number of rows the widget should span - either 1, 2 or 3
* __data__: the widget's data, which will be persisted to the database and used as the HTML template context

Putting it all together looks like this:

```javascript
ExampleWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 2,
    height: 1
  });

  _.defaults(this.data,{});

  /* Other widget code */
};

ExampleWidget.prototype = Object.create(Widget.prototype);
ExampleWidget.prototype.constructor = ExampleWidget;
```

To ensure your widget data gets persisted correctly, your widget has a `set` method, which you should whenever you want to save your widget's data. Like this:

```javascript
widgetInstance.set({
  countryCode: 'US',
  countryName: 'United States'
});
```

HTML Templates
--------------

Your widget package can include three different templates:
* a widget template: used to render the widget (required)
* a settings template: used to render a settings popup for the widget (optional)
* an info template: used to render an informational popup for the widget (optional)

To create templates, simple include templates in your package with following naming convention:
* For the widget: `{short code}Widget`, e.g. "ExampleWidget"
* For the settings popup: `{short code}Settings`, e.g. "ExampleSettings"
* For the info popup: `{short code}Info`, e.g. "ExampleInfo"

As a reminder, the "short code" is the name of the object your package exports.

To close the settings popup from a template's event handler (if the user has clicked a save button, for example), call `this.closeSettings(template)`. The `template` variable is your widget's template instance, which is the second arg to the event handler.

For CSS, all your widgets will receive a class with the same name as your widget package (__not__ the name of your widget's export), e.g. `.example-widget`. Scope all CSS within this class to prevent clashes with other widgets.

More Information
----------------

The Meteor model relies pretty heavily on subscriptions. The dashboard does not do anything special to handle widget subscriptions - you're on your own to manage any subscriptions you use in your widget.

This is just a quick-start primer. For more on writing Meteor packages, visit http://docs.meteor.com/#/full/writingpackages, and for more on Meteor in general, visit http://docs.meteor.com/#/full/.
