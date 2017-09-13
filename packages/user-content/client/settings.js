// Copyright (c) 2010-2013 Diego Perini, MIT licensed
// https://gist.github.com/dperini/729294
var urlPattern = new RegExp(
  "^" +
    // protocol identifier
    "(?:(?:https?|ftp)://)" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broacast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
      // host name
      "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
      // domain name
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
      // TLD identifier
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
      // TLD may end with dot
      ".?" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:[/?#]\\S*)?" +
  "$", "i"
);

// From http://stackoverflow.com/a/9682781
var colorPattern = /^#(?:[0-9a-f]{3}){1,2}$/i;

Template.UserContentSettings.helpers({
  activeClass: function(controlValue, thisValue) {
    return controlValue === thisValue ? 'btn-primary active' : '';
  }
});

Template.UserContentSettings.onRendered(function() {
  var template = this;
  _.extend($.minicolors.defaults, {
    changeDelay: 10,
    theme: 'bootstrap'
  });
  template.$('#user-content-text-color').minicolors({
    change: function(hex) {
      // A silly workaround to preview color changes
      $('#' + template.data.widget.componentId())
        .find('.user-content-text')
        .css('color', hex);
    },
  });
  template.$('#user-content-background-color').minicolors({
    change: function(hex) {
      // A silly workaround to preview color changes
      $('#' + template.data.widget.componentId())
        .find('.user-content-wrapper')
        .css('background-color', hex);
    },
  });
});

Template.UserContentSettings.events({
  'click .hori-align button': function(ev, template) {
    template.$('.hori-align button').removeClass('active btn-primary');
    template.$(ev.target).closest('button').addClass('active btn-primary');
  },
  'click .vert-align button': function(ev, template) {
    template.$('.vert-align button').removeClass('active btn-primary');
    template.$(ev.target).closest('button').addClass('active btn-primary');
  },
  'click #user-content-save': function(ev, template) {
    var newData = {};
    var backgroundColor = template.$('#user-content-background-color').val();

    if (colorPattern.test(backgroundColor)) {
      newData.backgroundColor = backgroundColor;
    } else {
      alert('Invalid background color');
    }

    var textColor = template.$('#user-content-text-color').val();
    if (colorPattern.test(textColor)) {
      newData.textColor = textColor;
    } else {
      alert('Invalid text color');
    }

    var newImageUrl = template.$('#user-content-image-url').val();
    if (newImageUrl === '' || urlPattern.test(newImageUrl)) {
      newData.imageUrl = newImageUrl;
    } else {
      alert('Invalid url');
    }

    var text = template.$('#user-content-text').val();
    newData.text = text.slice(0, 512);

    const horiAlign = template.$('.hori-align button.active').data('align');
    const vertAlign = template.$('.vert-align button.active').data('align');
    newData.textAlignHori = horiAlign;
    newData.textAlignVert = vertAlign;

    const fontSize = template.$('#user-content-font-size').val();
    newData.fontSize = parseInt(fontSize);

    if (!_.isEmpty(newData)) {
      this.set(newData);
    }
    template.closeSettings();
  }
});

