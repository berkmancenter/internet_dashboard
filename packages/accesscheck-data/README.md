AccessCheck Data
================

Purpose
-------
This package handles data retrieval from AccessCheck through Meteor methods. See also the [Link Availibity API doc](https://github.com/berkmancenter/im_core/blob/dev/doc/laapi.md).

Methods
-------
### getAccessData(url)

Gets the status/availibility data for the specified url for all countries. Returns an object structured as follows:

```javascript
{
	isOK: 'BOOLEAN. True if API request's result's status code is 200.',
	data: 'ARRAY. Structured per API spec.'
}
```

