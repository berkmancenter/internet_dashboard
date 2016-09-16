const Future = Npm.require('fibers/future');
const request = Npm.require('request');
const fut = new Future();
//

GoogleTrends.attachSchema(new SimpleSchema({
  widgetId:{
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  countryCode: {
    type: String
  },
keyword : {
    type: String
  },
  fetchedAt: {
    type: Date
  },
  score: {
    type: Number,
    decimal: true
}
}));

Meteor.publish('google_trends', function(keyword, widgetId) {
  console.log('publishing google_trends');
  var selector = {keyword: keyword, widgetId: widgetId };
  var options  = {fields: {score: 1, countryCode: 1} };
  console.log(selector);
  console.log(options);
  var docs = GoogleTrends.find(selector,options);
  return docs;
});

var twoDigitToThreeDigitCountryCode = function(two){
    var two2three= {'BD': 'BGD', 'BE': 'BEL', 'BF': 'BFA', 'BG': 'BGR', 'BA': 'BIH', 'BB': 'BRB', 'WF': 'WLF', 'BL': 'BLM', 'BM': 'BMU', 'BN': 'BRN', 'BO': 'BOL', 'BH': 'BHR', 'BI': 'BDI', 'BJ': 'BEN', 'BT': 'BTN', 'JM': 'JAM', 'BV': 'BVT', 'BW': 'BWA', 'WS': 'WSM', 'BQ': 'BES', 'BR': 'BRA', 'BS': 'BHS', 'JE': 'JEY', 'BY': 'BLR', 'BZ': 'BLZ', 'RU': 'RUS', 'RW': 'RWA', 'RS': 'SRB', 'TL': 'TLS', 'RE': 'REU', 'TM': 'TKM', 'TJ': 'TJK', 'RO': 'ROU', 'TK': 'TKL', 'GW': 'GNB', 'GU': 'GUM', 'GT': 'GTM', 'GS': 'SGS', 'GR': 'GRC', 'GQ': 'GNQ', 'GP': 'GLP', 'JP': 'JPN', 'GY': 'GUY', 'GG': 'GGY', 'GF': 'GUF', 'GE': 'GEO', 'GD': 'GRD', 'GB': 'GBR', 'GA': 'GAB', 'SV': 'SLV', 'GN': 'GIN', 'GM': 'GMB', 'GL': 'GRL', 'GI': 'GIB', 'GH': 'GHA', 'OM': 'OMN', 'TN': 'TUN', 'JO': 'JOR', 'HR': 'HRV', 'HT': 'HTI', 'HU': 'HUN', 'HK': 'HKG', 'HN': 'HND', 'HM': 'HMD', 'VE': 'VEN', 'PR': 'PRI', 'PS': 'PSE', 'PW': 'PLW', 'PT': 'PRT', 'SJ': 'SJM', 'PY': 'PRY', 'IQ': 'IRQ', 'PA': 'PAN', 'PF': 'PYF', 'PG': 'PNG', 'PE': 'PER', 'PK': 'PAK', 'PH': 'PHL', 'PN': 'PCN', 'PL': 'POL', 'PM': 'SPM', 'ZM': 'ZMB', 'EH': 'ESH', 'EE': 'EST', 'EG': 'EGY', 'ZA': 'ZAF', 'EC': 'ECU', 'IT': 'ITA', 'VN': 'VNM', 'SB': 'SLB', 'ET': 'ETH', 'SO': 'SOM', 'ZW': 'ZWE', 'SA': 'SAU', 'ES': 'ESP', 'ER': 'ERI', 'ME': 'MNE', 'MD': 'MDA', 'MG': 'MDG', 'MF': 'MAF', 'MA': 'MAR', 'MC': 'MCO', 'UZ': 'UZB', 'MM': 'MMR', 'ML': 'MLI', 'MO': 'MAC', 'MN': 'MNG', 'MH': 'MHL', 'MK': 'MKD', 'MU': 'MUS', 'MT': 'MLT', 'MW': 'MWI', 'MV': 'MDV', 'MQ': 'MTQ', 'MP': 'MNP', 'MS': 'MSR', 'MR': 'MRT', 'IM': 'IMN', 'UG': 'UGA', 'TZ': 'TZA', 'MY': 'MYS', 'MX': 'MEX', 'IL': 'ISR', 'FR': 'FRA', 'IO': 'IOT', 'SH': 'SHN', 'FI': 'FIN', 'FJ': 'FJI', 'FK': 'FLK', 'FM': 'FSM', 'FO': 'FRO', 'NI': 'NIC', 'NL': 'NLD', 'NO': 'NOR', 'NA': 'NAM', 'VU': 'VUT', 'NC': 'NCL', 'NE': 'NER', 'NF': 'NFK', 'NG': 'NGA', 'NZ': 'NZL', 'NP': 'NPL', 'NR': 'NRU', 'NU': 'NIU', 'CK': 'COK', 'XK': 'XKX', 'CI': 'CIV', 'CH': 'CHE', 'CO': 'COL', 'CN': 'CHN', 'CM': 'CMR', 'CL': 'CHL', 'CC': 'CCK', 'CA': 'CAN', 'CG': 'COG', 'CF': 'CAF', 'CD': 'COD', 'CZ': 'CZE', 'CY': 'CYP', 'CX': 'CXR', 'CR': 'CRI', 'CW': 'CUW', 'CV': 'CPV', 'CU': 'CUB', 'SZ': 'SWZ', 'SY': 'SYR', 'SX': 'SXM', 'KG': 'KGZ', 'KE': 'KEN', 'SS': 'SSD', 'SR': 'SUR', 'KI': 'KIR', 'KH': 'KHM', 'KN': 'KNA', 'KM': 'COM', 'ST': 'STP', 'SK': 'SVK', 'KR': 'KOR', 'SI': 'SVN', 'KP': 'PRK', 'KW': 'KWT', 'SN': 'SEN', 'SM': 'SMR', 'SL': 'SLE', 'SC': 'SYC', 'KZ': 'KAZ', 'KY': 'CYM', 'SG': 'SGP', 'SE': 'SWE', 'SD': 'SDN', 'DO': 'DOM', 'DM': 'DMA', 'DJ': 'DJI', 'DK': 'DNK', 'VG': 'VGB', 'DE': 'DEU', 'YE': 'YEM', 'DZ': 'DZA', 'US': 'USA', 'UY': 'URY', 'YT': 'MYT', 'UM': 'UMI', 'LB': 'LBN', 'LC': 'LCA', 'LA': 'LAO', 'TV': 'TUV', 'TW': 'TWN', 'TT': 'TTO', 'TR': 'TUR', 'LK': 'LKA', 'LI': 'LIE', 'LV': 'LVA', 'TO': 'TON', 'LT': 'LTU', 'LU': 'LUX', 'LR': 'LBR', 'LS': 'LSO', 'TH': 'THA', 'TF': 'ATF', 'TG': 'TGO', 'TD': 'TCD', 'TC': 'TCA', 'LY': 'LBY', 'VA': 'VAT', 'VC': 'VCT', 'AE': 'ARE', 'AD': 'AND', 'AG': 'ATG', 'AF': 'AFG', 'AI': 'AIA', 'VI': 'VIR', 'IS': 'ISL', 'IR': 'IRN', 'AM': 'ARM', 'AL': 'ALB', 'AO': 'AGO', 'AQ': 'ATA', 'AS': 'ASM', 'AR': 'ARG', 'AU': 'AUS', 'AT': 'AUT', 'AW': 'ABW', 'IN': 'IND', 'AX': 'ALA', 'AZ': 'AZE', 'IE': 'IRL', 'ID': 'IDN', 'UA': 'UKR', 'QA': 'QAT', 'MZ': 'MOZ'};
    return two2three[two].toLowerCase();
};

var dataToDocs = function(jsonData,keyword,widgetId) {
    var docs = [];
    _.each(jsonData.table.rows, function(row) {
        var doc = {
            countryCode: twoDigitToThreeDigitCountryCode(row.c[0].v),
            fetchedAt: new Date(),
            score: row.c[1].v,
            keyword: keyword,
            widgetId: widgetId,
        };
        docs.push(doc);
  });
  console.log('Pushing this many docs: ' + docs.length);
  return docs;
};

var fixupJson = function(badjs){
  var goodJson = badjs.substring(0,badjs.length-2);
  console.log('goodJson 1: ' + goodJson);
  goodJson = goodJson.replace(/^\/\/ Data table response/,'');
  console.log('goodJson 2: ' + goodJson);
  goodJson = goodJson.replace('google.visualization.Query.setResponse(','');
  console.log('goodJson 3: ' + goodJson);
  return goodJson;
};

//comment
var fetchData = function(widgetId,keyword) {
  console.log('REINOS GoogleTrends: Fetching data for ' + widgetId + ',' + keyword); //REINOS
  var jsonResponse, docs;
  var feedUrl='http://www.google.com/trends/fetchComponent?hl=en-US&geo=&q=' + keyword + '&cid=GEO_MAP_0_0&export=3&w=500&h=500';
//  var feedUrl = 'http://localhost:8080/~theobleier/json.json';

  request({url: feedUrl,  method: 'GET',headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:10.0) Gecko/20100101 Firefox/10.0'}}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      fut.return(body);
      console.log(body);
  } else {
    console.log(error);
    console.log(response);
    console.log(body);
  }
});
  try {
    // They are returning their json as js so response.data doesn't work.
    // we have to explicitly parse response.content.
    //docs = dataToDocs(jsonResponse.data.data);
    //docs = dataToDocs(JSON.parse(jsonResponse.content).data);
    //docs = dataToDocs(jsonResponse.data);
    docs = dataToDocs(JSON.parse(fixupJson(fut.wait())),keyword,widgetId);
  } catch (e){
    console.error('c: Error converting data to docs');
    console.error(e);
  }
  if (docs.length > 0) {
    console.log('GoogleTrends: We got new data. Removing old...');
    GoogleTrends.remove({});
  } else {
    console.log('GoogleTrends: No new data.');
  }

  _.each(docs, function(doc) {
    console.log("Inserting doc: " + doc);
    GoogleTrends.insert(doc);
  });
  console.log('GoogleTrends: Fetched data');
  //GoogleTrends._ensureIndex({widgetId:1});
  //console.log('GoogleTrends: Indexed data');
};

Meteor.methods({
  updateGoogleTrendsMap: function(keyword,widgetId){
  //  console.log("This is ", this);
    console.log("updating google trends: " + keyword + ','+ widgetId);
    fetchData(widgetId, keyword);
  }
});
