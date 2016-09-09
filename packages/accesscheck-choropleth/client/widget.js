Template.AccessCheckChoroplethWidget.helpers({
  ready: function(){
    var id = Template.instance().data.widget._id;
    return Session.get(id+'-ready');
  },
  header: function(){ 
    return Template.currentData().url ? Template.currentData().url.replace(/https?:\/\//, '') : 'No specified link';
  }
});

Template.AccessCheckChoroplethWidget.onRendered(function() {
  var template = this;
  var id = Template.instance().data.widget._id;

  template.autorun(function() {
    Session.set(id+'-ready', false);
    template.$('.accesscheck-choropleth-data').hide();
    template.$('.accesscheck-error').empty();
    if (!template.subscriptionsReady() || !Template.currentData().url) {  return;  }

    var currData = Template.currentData();

    Meteor.call('getAccessData', currData.url, function(error, result){
      Session.set(id+'-ready', true);
      if(!result.isOK){
       template.$('.accesscheck-error').text('An error occurred while trying to retrieve the data. Please try again later.');
       return; 
     }
     else if(result.data.length === 0){
        template.$('.accesscheck-error').text('No test data available for this URL yet.');
        return;
     }
      var countryDataByCode = {};
      var countries = result.data; // get list of all countries
      for(var i=0; i<countries.length; i++){
        var d = countries[i].attributes;
        d.statusConfidence = countries[i].attributes.statusConfidence * 100;
        var currCode = d.country;
        countryDataByCode[currCode] = d;
      }
      var map = new ChoroplethMap();
      map.draw({
        selector: template.find('.accesscheck-choropleth-data'),
        data: countryDataByCode,
        dims: Settings.map,
        iso: 2,
        colors: Settings.colors,
        valueKey: 'status',
        shadeKey: 'statusConfidence',
        valueSuffix: '% confidence'
      });
    });
  });
});
