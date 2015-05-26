 An Epoch Meteor
================

[Epoch](http://fastly.github.io/epoch/) Charts for [Meteor](http://docs.meteor.com/)

Packaged by [Tim Pfafman](https://github.com/pfafman/meteor-epoch)
Repackaged by jdcc


### Requirements
* [d3js:d3](https://atmospherejs.com/d3js/d3)


### How do I install this?
meteor add pfafman:epoch

### Notes

####[Compatibility Directory](http://docs.meteor.com/#structuringyourapp)

You can also instead of installing this package just download the epoch.js and epoch.css files and place the former in your compatibility directory
```
  /client/compatibility/epoch.js
```
That also works.

#### Getting graphs to work

So I played with this and was getting terrible looking crap until I did the following in the html template for the graph

```html
  <div id="chart" class="epoch the-epoch-chart"></div>
```

Note the epoch class.  The other stuff I saw in the docs produced sh*t but when I did the above it worked.  Also I have the size defined in the css class `the-epoch-chart`.

### References
* [Meteor](http://docs.meteor.com/)
* [Epoch](http://fastly.github.io/epoch/)
* [D3](http://d3js.org)
