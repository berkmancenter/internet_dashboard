Widget Data Pattern
===================

Overview
--------

This document outlines a beginning pattern for requesting data from a source, storing it in mongodb on the server, and shipping it to client widgets via subscriptions.

package.js
----------

First, you need to tell meteor your package will use mongo on both server & client by adding it to one of your api.use statements in package.js. Also, if you are planning to pull data from an online source, you will need to use http on the server.

```javascript
api.use( [ 'widget', 'mongo' ] );

api.use( [ 'http' ], 'server' );
```

To follow the pattern of other widgets, you should also add a server.js file as a server resource in package.js. The server.js file will actually perform the request to your data source, process the data if necessary, and store the data in mongodb.

```javascript
api.addFiles( 'server.js', 'server' );
```

foo.js
------

In the file where you define & export your widget object, create a Mongo collection into which you will store data that your widget will use/reference. You can create the collection at the top of the widget's definition file and give the collection any name you want.

```javascript
RecentlyChanged = new Mongo.Collection( 'recently_changed' );
```

server.js
---------

As we said, the new server.js file will actually request the data and store it in Mongo. It will also publish an event saying the data has been updated so widgets can update their display.

The first part of server.js is a function definition, we'll just call updateData, that does the request/store work.

```javascript
var updateData = function() {
  var jsonData = HTTP.get( 'http://api.example.com/changed' );
 
  RecentlyChanged.remove( {} );
  RecentlyChanged.insert( jsonData );
};
```

In this sample's simple case, all the data changes every day and there's not much to tie one day to another. So we simply remove all the old data (pass an empty object to remove) and insert the new data. You can check out other widgets or meteor docs ( http://docs.meteor.com/#/full/ ) for different methods to store & update data such as updating specific documents by key or creating a capped collection where old data falls of the end as new data is inserted. In our simple case, all the data is added to Mongo as a single document, e.g., only one insert statement.

Next, we have to actually call the updateData function once so that data gets into Mongo.

```javascript
updateData();
```

We can then setup an interval so that updateData is called again every 24 hours (86400000ms).

```javascript
Meteor.setInterval( updateData, 86400000 );
```

Finally, publish a Meteor event that all clients can subscribe to in order to get the data and be notified when the data changes. For this example, each client gets all the data as it won't change for 24-hours. An event must return a cursor, and the find function with no arguments will return a cursor to the whole dataset.

```javascript
Meteor.publish( 'recently_changed', function() {
  return RecentlyChanged.find();
});
```

The event name does not have to match the collection name.

client/widget.js
----------------

The next step is to provide access to the data to your widget on the client. In the widget's JavaScript file, you can access the data using the Mongo collection we created in foo.js: RecentlyChanged. Since we stored all the data as one document in the collection, we can call findOne to get it. The data we added is simply stored in the data attribute of the object returned by findOne (even though we called it jsonData in server.js).

```javascript
var jsonData = RecentlyChanged.findOne().data;
```

You can visualize the data however you want using JavaScript in the widget's onRendered callback. However, to access the data in the HTML template, we can setup a helper function.

```javascript
Template.FooWidget.helpers( {
  changed: function( ) {
    return RecentlyChanged.findOne().data;
  }
} );
```

client/widget.html
------------------

With the helper function in place, we can access the data in the HTML template by referencing the helper function's name as if it were a property. We can loop over the data with {{# each }} and render properties of each object with {{ }}.

```html
<ul>
  {{# each changed }}
  <li>{{ country.iso3 }}</li>
  {{/each}}
</ul>
```

There are many other ways to get data visualized in your widget, but this pattern should be a good starting point.
