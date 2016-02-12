
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
      console.log('1.RDR: Parsing TSV company data file...');
      if(err){
        console.error('RDR: TSV parse error');
        console.error(err);
        return;
      }
      output.forEach(function(row){
        console.log('1.1.RDR:company from TSV');
        console.log(row);
        companyMap[row.company]=row;
      });
      console.log('2.RDR: done with TSV company data file.');
    });
  

  Meteor.wrapAsync(csvParse)(
    csvText,
    { columns: true, auto_parse: true },
    function(err, output) {
      console.log('3.RDR: Parsing CSV service data file...');
      if (err) {
        console.error('RDR: CSV parse error');
        console.error(err);
        return;
      }
      var service_metrics = [];
      var company_metrics = [];
      output.forEach(function(row) {
        var company = companyMap[row.company];
        console.log('3.1.RDR:row');
        console.log(row);
        console.log('3.2.RDR:company');
        console.log(company);
        service_metrics.push({ name: row.metric, value: row.value, rank: row.rank });
        company_metrics.push({ name: row.metric, value: company[row.metric] });
        if (service_metrics.length < 4) {
          // still collecting metrics...
          // when we have four, we will have them all and can insert!
          return;
        }
        try {
          console.log('3.3.RDR:inserting row!');
          RDRData.insert({
            category: row.category,
            service: row.service,
            company: company.name,
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
      console.log('4.RDR: Done with CSV service data file.');
    });

}

if (Meteor.settings.doJobs) {
  RDRData.remove({});
  parseData();
}

Meteor.publish('ranking_digital_rights', function(category) {
  return RDRData.find({ category: category });
});
