ImageBlockWidget = function(doc) {
  Widget.call(this, doc);

  _.extend(this, {
    width: 1,
    height: 1
  });

  _.defaults(this.data,{
    imageUrl: 'http://lorempixel.com/150/150'
  });
};
ImageBlockWidget.prototype = Object.create(Widget.prototype);
ImageBlockWidget.prototype.constructor = ImageBlockWidget;

ImageBlock = {
  widget: {
    name: 'Image Widget',
    description: 'This widget allows you to add an image to your dashboard.',
    url: 'http://example.com/',
    constructor: ImageBlockWidget
  }
};
