Template.WidgetsEmbed.helpers(CommonHelpers);
Template.WidgetsEmbed.helpers({
  dashboardUrl: function() { return Meteor.absoluteUrl(); },
});

Template.WidgetEmbedCode.helpers({
  embedAttrs: function() {
    return 'src="' + Meteor.absoluteUrl('widgets/' + this._id + '/embed') + '" ' +
      'width="' + this.pixelDims().width + '" ' +
      'height="' + (this.pixelDims().height + Widget.Settings.logoBar.height) + '"';
  }
});

Template.WidgetsEmbed.onRendered(CommonOnRendered);
