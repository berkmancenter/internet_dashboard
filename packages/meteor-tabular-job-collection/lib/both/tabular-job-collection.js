/* global TabularJobCollections:true */
/* global Tabular:false - from aldeed:tabular */
/* global moment:false - from momentjs:moment */

if (Meteor.isClient) {
  var TabularJobCollectionsHelper = {};
  Template.registerHelper('TabularJobCollections', TabularJobCollectionsHelper);
}

TabularJobCollections = function (definitions) {
  _.each(definitions, function (definition, collectionName) {
    if (_.has(TabularJobCollections._tables, collectionName)) {
      throw new Error('TabularJobCollections: Table already defined for ' + collectionName);
    }

    TabularJobCollections._tables[collectionName] = TabularJobCollections._makeTabularTable(collectionName, definition);

    // On the client, create a helper so that the table object can be accessed by {{TabularJobCollections.collectionName}}
    if (Meteor.isClient) {
      TabularJobCollectionsHelper[collectionName] = TabularJobCollections._tables[collectionName];
    }
  });
};

TabularJobCollections._tables = {};

TabularJobCollections._dateRenderFunction = function (val) {
  if (val instanceof Date) {
    return moment(val).format('llll');
  } else if (val) {
    return 'Unknown';
  }
};

TabularJobCollections._makeTabularTable = function (collectionName, definition) {
  var table = {
    name: collectionName,
    columns: [
      {data: '_id', title: 'ID'},
      {
        data: 'created',
        title: 'Created',
        render: TabularJobCollections._dateRenderFunction
      },
      {data: 'type', title: 'Type'},
      {
        data: 'data',
        title: 'Data',
        render: function (val) {
          return JSON.stringify(val);
        },
        orderable: false
      },
      {data: 'status', title: 'Status'},
      {
        data: 'after',
        title: 'After',
        render: TabularJobCollections._dateRenderFunction
      },
      {
        data: 'failures',
        title: 'Failures',
        tmpl: Meteor.isClient && Template['TabularJobCollections.failures'],
        orderable: false
      },
      {
        tmpl: Meteor.isClient && Template['TabularJobCollections.buttons']
      }
    ],
    // Sort by created descending initially
    order: [[1, "desc"]],
    createdRow: function(row, data) {
      // set row class based on row data
      if (data.status === 'failed') {
        $(row).addClass('danger');
      }
    },
    autoWidth: false,
    extraFields: ['updated']
  };

  table = _.extend(table, definition);

  return new Tabular.Table(table);
};
