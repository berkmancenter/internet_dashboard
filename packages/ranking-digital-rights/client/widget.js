

var grains = {};

grains[Settings.SERVICES_BY_CATEGORY] = {
  name  : "Service",
  sliceDescription : function(){ return Template.currentData().category; },
  contextName : "Company",
  recordContext: function(record){ return record.company; },
  fetchRecords: function (){ return RDRServiceData.find({ category: Template.currentData().category }).fetch();}
};

grains[Settings.SERVICES_BY_COMPANY] = {
  name  : "Service",
  sliceDescription : function(){ return Template.currentData().companyName; },
  contextName : "Category",
  recordContext: function(record){ return record.category; },
  fetchRecords : function() {
    var companyName = Template.currentData().companyName;
    var services = RDRServiceData.find({ company: companyName} ).fetch();
    var company  = RDRCompanyData.find({ name: companyName} ).fetch()[0];
    company.category = "All services (entire company)";
    services.unshift(company);
    return services;
  }
};

grains[Settings.COMPANIES_BY_TYPE] = {
  name  : "Company",
  sliceDescription : function(){ return Template.currentData().companyType; },
  contextName : "",
  recordContext: function(record){ return ""; } ,
  fetchRecords : function() { return RDRCompanyData.find( {type: Template.currentData().companyType}).fetch() ;}
};

Template.RDRWidget.helpers({
  metrics: function() {
    return Settings.metrics;
  },
  isSorted: function() {
    return this.name === Template.parentData().sortMetric ? 'sorted' : 'not-sorted';
  },
  granularityName: function(){
    var grain =grains[Template.currentData().granularity];
    if (grain === grains[Settings.SERVICES_BY_CATEGORY]  &&
      Template.currentData().category.match(/^Mobile|Fixed broadband$/)){
      // We call "Services" "Holding Companies" when they're in certain categories.
      return "Holding Company";
    } else {
      return grain.name;
    }
  },
  contextName: function(){
    return grains[Template.currentData().granularity].contextName;
  },
  sliceDescription: function(){
    return grains[Template.currentData().granularity].sliceDescription();
  }
});

Template.RDRWidget.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('ranking_digital_rights_services',{});
    template.subscribe('ranking_digital_rights_companies',{});
  });
});

Template.RDRWidget.onRendered(function() {
  var template = this;
  var pieColors = d3.scale.category10();
  var $serviceList = template.$('table tbody');
  template.autorun(function() {
    if (!template.subscriptionsReady()) { return; }

    var granularity = Template.currentData().granularity;
    var category    = Template.currentData().category;
    var sort        = Template.currentData().sortMetric;

    var grain = grains[granularity] || console.log("unknown granularity: " + granularity);
    
    var $metrics, serviceSlug, data, selector, cell, records;

    $serviceList.empty();

    records = grain.fetchRecords();
    
    records = _.sortBy(records, function(record) {
      return _.findWhere(record.metrics, { name: sort }).value*-1;
    });

    records.forEach(function(record) {
      var name = record.name;
      // disambiguate between services in multiple categories that may now be presented 
      var id   = record.category ? record.name + record.category : record.name;
      serviceSlug = s.slugify(id);
      $serviceList.append(
        '<tr class="service service-' + serviceSlug + '">' +
          '<td><div class="service">' + name +  (_.contains(['Mobile','Fixed broadband'],record.category) ? ' (' + record.country +')' : '') + '</div><div class="company">' + grain.recordContext(record) + '</div></td>' + '</tr>');
      selector = '.service-' + serviceSlug;
      metricsNode = template.find(selector);
      Settings.metrics.forEach(function(metric) {
        var metricData = _.findWhere(record.metrics, { name: metric.name });
        data = [metricData.value, 100.0 - metricData.value];
        cell = $('<td>').addClass('text-center').appendTo(metricsNode).get(0);
        radius = metric.name === Settings.totalMetric ?
          Settings.pie.totalRadius : Settings.pie.radius;
        drawGraph(cell, data, radius, pieColors(metric.name));
      });
    });
  });
});

function drawGraph(parent, data, radius, color) {
  
  var width     = radius,
      height    = radius +20;
  var pieRadius = radius / 2;

  var arc = d3.svg.arc()
    .outerRadius(pieRadius)
    .innerRadius(Settings.pie.innerRadius);

  var pie = d3.layout.pie().startAngle(Math.PI).endAngle(3 * Math.PI).sort(null);

  var svg = d3.select(parent).append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + radius / 2 + "," + radius / 2 + ")");

  var g = svg.selectAll(".arc")
      .data(pie([data[0],data[1]]))
    .enter().append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", arc)
    .style("fill", function(d, i) {
      return i === 0 ? color: Settings.pie.background;
    });

  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', 4)
    .text(Math.round(data[0]));

}
