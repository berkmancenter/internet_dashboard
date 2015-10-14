Template.WidgetsJobs.helpers({
  jobsTable: function() {
    return TabularJobCollections._tables[WidgetJob.Settings.queueName];
  }
});
