Template.UserContentWidget.helpers({
  style: function() {
    var backgroundRule = 'background-color: ' + this.backgroundColor + ';';
    if (this.imageUrl) {
      backgroundRule += 'background-image: url("' + this.imageUrl + '"); ' +
        'background-size: cover;'; 
    }
    var textColorRule = 'color: ' + this.textColor + ';';
    return {
      style: backgroundRule + ' ' + textColorRule
    };
  }
});
