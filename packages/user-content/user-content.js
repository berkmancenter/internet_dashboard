UserContentWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data,{
    imageUrl: false,
    backgroundColor: '#97c284',
    textColor: '#FFFFFF',
    text: 'Put your text here!'
  });
};
UserContentWidget.prototype = Object.create(Widget.prototype);
UserContentWidget.prototype.constructor = UserContentWidget;

UserContent = {
  widget: {
    name: 'Your Content',
    description: 'Allows you to add text and/or an image to your dashboard',
    dimensions: { width: 2, height: 1 },
    resize: {
      constraints: { width: { max: 10 }},
      mode: 'reflow'
    },
    url: 'http://thenetmonitor.org/',
    typeIcon: 'user',
    constructor: UserContentWidget,
    settings: 'edit settings'
  }
};
