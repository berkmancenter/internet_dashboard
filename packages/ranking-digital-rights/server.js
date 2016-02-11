function parseData() {
  var csvParse = Npm.require('csv-parse');
  var csvText = Assets.getText('rdr_index.csv');

  console.log('RDR: Parsing CSV file');
  Meteor.wrapAsync(csvParse)(csvText,
      { columns: true, auto_parse: true }, function(err, output) {
    if (err) {
      console.error('RDR: CSV parse error');
      console.error(err);
      return;
    }

    var metrics = [];
    output.forEach(function(row) {
      metrics.push({ name: row.metric, value: row.value, rank: row.rank });
      if (metrics.length < 4) { return; }

      try {
        RDRData.insert({
          category: row.category,
          company: row.company,
          metrics: metrics
        });
        metrics = [];
      } catch (error) {
        console.error(error);
      }
    });
  });
}

if (Meteor.settings.doJobs) {
  RDRData.remove({});
  parseData();
}

Meteor.publish('ranking_digital_rights', function(category) {
  return RDRData.find({ category: category });
});
