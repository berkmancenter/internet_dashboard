Internet Monitor (IMon) Data
============================

This package's aim is to fetch, seed, structure, and regulate everything related to [data provided by the Internet Monitor](https://thenetmonitor.org/sources/dashboard-data). 

### Use

If the project is run in data fetch mode (see [getting_started.md](../../docs/getting_started.md)), the server should start fetching IMon data and seeding it into the databases detailed below.

#### What to expect

1. Log messages for: fetch start, fetch end, insert start, and insert end for `IMonData: [Countries]` and `IMonData: [Indicators]`.
2. At this point in time ([release of v2 in prod](https://thenetmonitor.org/v2/countries)), country data is relatively large (~4MB) and will take a while to process compared to other data being fetched and seeded because of the historical data it provides.

For more information about the structure of the data, see [the Internet Monitor repo](https://github.com/berkmancenter/internet_monitor/blob/dev/doc/platform_data_api.md).

#### Note

In addition to the data from v2 being fetched, old data (from v1) are also being fetched (console messages: `IMonData: [Old API]`) because of some backwards compatibility issues.

### Database

See schemas in [imon-data.js](imon-data.js).

#### IMonData
Contains individual data points including historical data.

#### IMonIndicators
Contains metadata about the indicators.

#### IMonCountries
Contains metadata about the countries.

#### IMonRecent
Contains latest available values for every country/indicator combination.

#### IMonDataD, IMonIndicatorsD, IMonCountriesD
Similar purpose, but seeded with data from v1 of the API. (No longer updated)

### Publications/Subscriptions

#### imon_data_v2(countries, indicators, recentOnly)

##### Parameters:
- countries: one country code, an array of country codes, or 'all'.
- indicators: one indicator admin name, an array of indicator admin names, or 'all'.
- recentOnly: boolean. True if only latest available data for each country/indicator combination is requested.

#### Returns:
- If recentOnly: IMonRecent cursor.
- Else: IMonData cursor.

#### imon_indicators_v2()

Returns an IMonIndicators cursor.

#### imon_countries_v2()

Returns an IMonCountries cursor.

