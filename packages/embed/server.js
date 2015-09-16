Meteor.methods({
  setContent: function(id, content) {
    var widget = Widgets.findOne(id);
    var sanitize = Npm.require('sanitize-html');
    var cleanContent = sanitize(content, {
      allowedTags: ['iframe'],
      allowedAttributes: {
        'iframe': ['width', 'height', 'src', 'allowfullscreen',
                   'sandbox', 'frameborder']
      },
      transformTags: {
        'iframe':
          sanitize.simpleTransform('iframe',
              { sandbox: 'allow-scripts allow-same-origin allow-popups',
                frameborder: 0 })
      }
    });
    widget.data.set({ embedCode: cleanContent });
  }
});
