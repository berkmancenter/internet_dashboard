Settings = {
  listLength: 20
};

GlobalVoicesWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    feedUrl: '',
  });
};
GlobalVoicesWidget.prototype = Object.create(Widget.prototype);
GlobalVoicesWidget.prototype.constructor = GlobalVoicesWidget;

GlobalVoices = {
  widget: {
    name: 'Recent Global Voices Stories',
    description: 'Shows recent Global Voices stories from a selected country',
    dimensions: { width: 2, height: 3 },
    resize: { mode: 'reflow' },
    constructor: GlobalVoicesWidget
  }
};
