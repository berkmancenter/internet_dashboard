
function parseServiceData(companyMap){
  console.log("RankingDigitalRights: Loading service data");
  var csvParse = Npm.require('csv-parse');
  var csvText = Assets.getText('rdr_index.csv');
  Meteor.wrapAsync(csvParse)(
    csvText,
    { columns: true, auto_parse: true },
    function(err, output) {
      if (err) {
        console.error('RankingDigitalRights: Error parsing service data from cvs file!', error);
        return;
      }
      var service_metrics = [];
      output.sort((a, b) => {
        var byCompany = a.company.localeCompare(b.company);
        if (byCompany !== 0) { return byCompany; }
        var byService = a.service.localeCompare(b.service);
        if (byService !== 0) { return byService; }
        var byCategory = a.category.localeCompare(b.category);
        return byCategory;
      });
      //TODO Looks like this is relying on specific ordering of the data. I've
      //ordered things above to ensure that, but removing this assumption would
      //be nice.
      output.forEach(function(row) {
        var company = companyMap[row.company];
        service_metrics.push({ name: row.metric, value: row.value, rank: row.rank });
        if (service_metrics.length < 4) {
          // still collecting metrics...
          // when we have four, we will have them all and can insert!
          return;
        }
        try {
          RDRServiceData.insert({
            category: row.category,
            name: row.service,
            company: company.name,
            metrics: service_metrics
          });
          service_metrics = [];
        } catch (error) {
          console.error("ranking digital rights: Error inserting service data into Mongo!",error);
        }
      });
    });
}

function parseCompanyData() {
  console.log("RankingDigitalRights: Loading company data");
  var type2pretty = {
    'internet company' : 'Internet',
    'telco' : 'Telecommunications'
  };
  var tsvParse = Npm.require('csv-parse');
  var tsvText  = Assets.getText('rdr_companies.tsv');
  var companyMap={};
  var metricKeys = ['Total','Governance','Freedom of Expression','Privacy'];
  var companyCount=0;
  Meteor.wrapAsync(tsvParse)(
    tsvText,
    {columns: true, auto_parse: true, delimiter: '\t'},
    function(err,output){
      if(err){
        console.error('RankingDigitalRights: Error parsing company data from tsv file!', error);
        return;
      }
      output.forEach(function(row){
        companyCount++;
        var metrics = [];
        _.each(metricKeys,function(key){
          metrics.push({ name: key , value: row[key] });
        });
        var company = {
          name: row.company,
          metrics: metrics,
          type: type2pretty[row.company_type]
        };
        companyMap[company.name]=company;
        try {
          RDRCompanyData.insert(company);
        } catch (error){
          console.error("RankingDigitalRights: Error inserting service data into Mongo!",error);
        }
      });
      // now that we're sure that we're done with companydata, load service data.
      parseServiceData(companyMap);
    });
}

function parseData(){
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


