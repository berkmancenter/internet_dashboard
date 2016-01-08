EmbedWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data, {
    embedCode: ''
  });
};
EmbedWidget.prototype = Object.create(Widget.prototype);
EmbedWidget.prototype.constructor = EmbedWidget;

Embed = {
  widget: {
    name: 'Embed',
    description: 'Turns an embeddable object into a widget',
    dimensions: { width: 2, height: 2 },
    resize: { mode: 'reflow' },
    url: 'https://thenetmonitor.org',
    typeIcon: 'external-link',
    constructor: EmbedWidget
  }
};
