Template.WidgetsEmbed.helpers(CommonHelpers);
Template.WidgetsEmbed.helpers({
  dashboardUrl: function() { return Meteor.absoluteUrl(); },
});

Template.WidgetEmbedCode.helpers({
  embedAttrs: function() {
    return 'src="' + Meteor.absoluteUrl('widgets/' + this._id + '/embed') + '" ' +
      'width="' + (this.pixelDims().width + 8) + '" ' +
      'height="' + (this.pixelDims().height + Widget.Settings.logoBar.height) + '"'
      + ' seamless="seamless" frameBorder="0" style="margin:1em;"';
  }
});

Template.WidgetsEmbed.onRendered(CommonOnRendered);
