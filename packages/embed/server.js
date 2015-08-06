Meteor.methods({
  setContent: function(id, content) {
    var widget = Widgets.findOne(id);
    var sanitize = Npm.require('sanitize-html');
    var cleanContent = sanitize(content, {
      allowedTags: ['iframe'],
      allowedAttributes: {
        'iframe': ['width', 'height', 'src', 'allowfullscreen']
      },
      transformTags: {
        'iframe':
          sanitize.simpleTransform('iframe', { sandbox: '', frameborder: 0 })
      }
    });
    widget.data.set({ embedCode: cleanContent });
  }
});
