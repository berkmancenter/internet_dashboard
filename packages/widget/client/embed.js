Template.WidgetsEmbed.helpers(CommonHelpers);

Template.WidgetEmbedCode.helpers({
  embedAttrs: function() {
    return 'src="' + Meteor.absoluteUrl('widgets/' + this._id + '/embed') + '" ' +
      'width="' + this.pixelDims().width + '" ' +
      'height="' + this.pixelDims().height + '"';
  }
});

Template.WidgetsEmbed.onRendered(CommonOnRendered);
