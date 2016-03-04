
function parseData() {
  var csvParse = Npm.require('csv-parse');
  var csvText = Assets.getText('rdr_index.csv');

  var tsvParse = Npm.require('csv-parse');
  var tsvText  = Assets.getText('rdr_companies.tsv');

  var companyMap={};

  Meteor.wrapAsync(tsvParse)(
    tsvText,
    {columns: true, auto_parse: true, delimiter: '\t'},
    function(err,output){
      console.log('RDR: Parsing TSV company data file...');
      if(err){
        console.error('RDR: TSV parse error');
        console.error(err);
        return;
      }
      output.forEach(function(row){
        //console.log('REINOS. reading company:');
        //console.log(row);
        companyMap[row.company]=row;
      });
    });
  

  Meteor.wrapAsync(csvParse)(
    csvText,
    { columns: true, auto_parse: true },
    function(err, output) {
      console.log('RDR: Parsing CSV service data file...');
      if (err) {
        console.error('RDR: CSV parse error');
        console.error(err);
        return;
      }
      var service_metrics = [];
      var company_metrics = [];
      output.forEach(function(row) {

        //console.log('REINOS. reading service:');
        //console.log(row);
        //console.log('REINOS: company key is : ' + row.company );
        var company = companyMap[row.company];
        //console.log('REINOS: ths company I found by that key is ');
        //console.log(company);

        if ( ! company ) {
          console.log("die this is shit");
          exit();
        }

        
        service_metrics.push({ name: row.metric, value: row.value, rank: row.rank });
        company_metrics.push({ name: row.metric, value: company[row.metric] });
        if (service_metrics.length < 4) {
          // still collecting metrics...
          // when we have four, we will have them all and can insert!
          return;
        }
        try {
          RDRData.insert({
            category: row.category,
            service: row.service,
            company: company.company,
            country: company.country,
            company_metrics: company_metrics,
            service_metrics: service_metrics
          });
          service_metrics = [];
          company_metrics = [];
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
