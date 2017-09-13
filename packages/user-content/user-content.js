UserContentWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data,{
    imageUrl: false,
    backgroundColor: '#97c284',
    textColor: '#FFFFFF',
    textAlignHori: 'center',
    textAlignVert: 'middle',
    text: 'Put your text here!',
    fontSize: 42,
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
      constraints: { width: { max: 12 }},
      mode: 'reflow'
    },
    url: 'http://thenetmonitor.org/',
    typeIcon: 'user',
    constructor: UserContentWidget,
    settings: 'edit settings'
  }
};
