IM Access Index
===============

Data
----
Static data supporting the widget is in [rankData.csv](rankData.csv) in the following order per row:
	1. Country code (ISO 3166-1 alpha-3)
	2. Country name
	3. Score
	4. Rank
Last updated in 2014. 

Server
------
A Meteor method called `rankData`, with no parameters, returns an object as follows:
```javascript
{
	COUNTRY1_CODE: { code: COUNTRY1_CODE, rank: COUNTRY1_RANK, score: COUNTRY1_SCORE, name: COUNTRY1_NAME },

	COUNTRY2_CODE: { code: COUNTRY2_CODE, rank: COUNTRY2_RANK, score: COUNTRY2_SCORE, name: COUNTRY2_NAME },
	.
	.
	.
};
```

Client
------
Once the async call to server is done, a Session variable named `WIDGET_ID + '-data'` is set to `true` and the server's result is attached to a js variable and used accordingly.