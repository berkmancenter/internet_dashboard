ImageBlockWidget = function(doc) {
  Widget.call(this, doc);

  _.defaults(this.data,{
    imageUrl: 'http://lorempixel.com/150/170'
  });
};
ImageBlockWidget.prototype = Object.create(Widget.prototype);
ImageBlockWidget.prototype.constructor = ImageBlockWidget;

ImageBlock = {
  widget: {
    name: 'Image Widget',
    description: 'This widget allows you to add an image to your dashboard.',
    dimensions: { width: 1, height: 1 },
    url: 'http://example.com/',
    constructor: ImageBlockWidget
  }
};
