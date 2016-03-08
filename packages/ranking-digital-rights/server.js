var Future = Npm.require('fibers/future');

function parseServiceData(companyMap){
  console.log("RDR:PSD (A)");
  var csvParse = Npm.require('csv-parse');
  var csvText = Assets.getText('rdr_index.csv');
  Meteor.wrapAsync(csvParse)(
    csvText,
    { columns: true, auto_parse: true },
    function(err, output) {
      console.log('RDR:PSD (B)Parsing CSV service data file');
      if (err) {
        console.error('RDR:PSD CSV parse error');
        console.error(err);
        return;
      }
      var service_metrics = [];
      output.forEach(function(row) {
        console.log("RDR:PSD (M) service:" + row.service);
        var company = companyMap[row.company];
        //console.log("SERVICE company string: " , row.company);
        //console.log("REINOS: company for service: ", company);
        service_metrics.push({ name: row.metric, value: row.value, rank: row.rank });
        if (service_metrics.length < 4) {
          // still collecting metrics...
          // when we have four, we will have them all and can insert!
          return;
        }
        try {
          //console.log("REINOS: inserting RDRServiceData!");
          //console.log("RDR service metrics:",service_metrics);
          RDRServiceData.insert({
            category: row.category,
            name: row.service,
            company: company.name,
            country: company.country,
            metrics: service_metrics
          });
          service_metrics = [];
        } catch (error) {
          console.error("RDR: Error inserting service data.",error);
        }
        try {
          if ( ! _.contains(company.categories,row.category) ) {
            company.categories.push(row.category);
            RDRCompanyData.update({name:company.name},{ $set: {  categories :company.categories } } );
          }
        } catch(error) {
          console.log("RDR: Error updating company data with service categories.", error);
        }
      });
    });
}

function parseCompanyData() {
  console.log("RDR:PCD (A)");
  var tsvParse = Npm.require('csv-parse');
  var tsvText  = Assets.getText('rdr_companies.tsv');
  var companyMap={};
  var metricKeys = ['Total','Commitment','Freedom of expression','Privacy'];
  var companyCount=0;
  Meteor.wrapAsync(tsvParse)(
    tsvText,
    {columns: true, auto_parse: true, delimiter: '\t'},
    function(err,output){
      console.log('RDR:PCD (B) Parsing TSV company data file...');
      if(err){
        console.error('RDR: TSV parse error');
        console.error(err);
        return;
      }
      output.forEach(function(row){
        companyCount++;
        var picked = _.pick(row,metricKeys);
        var pairs  = _.pairs(picked);
        var objectifiedPairs = _.map(pairs,function(p){return {name: p[0], value: p[1]};});
        console.log("RDR:PCD (M): " + companyCount + " read tsv row..." + row.company);
        var company = {
          name: row.company,
            country: row.country,
          metrics: objectifiedPairs,
          categories: []
        };
        companyMap[company.name]=company;
        try {
          console.log("This is what we are inserting baby", company);
          RDRCompanyData.insert(company);
        } catch (error){
          console.error("RDR: Error inserting company data.", error);
        }
      });
      console.log('RDR:PCD (X): DONE. Parsing TSV company data file');
      // now that we're sure that we're done with companydata, load service data.
      parseServiceData(companyMap);
    });
  console.log('RDR:PCD (Z)');
};

function parseData(){
  console.log("RDR:parseData!");
  parseCompanyData();
}

if (Meteor.settings.doJobs) {
  RDRCompanyData.remove({});
  RDRServiceData.remove({});
  parseData();
}

Meteor.publish('ranking_digital_rights_services', function(query) {
  return RDRServiceData.find(query);
});

Meteor.publish('ranking_digital_rights_companies', function(query) {
  return RDRCompanyData.find(query);
});


