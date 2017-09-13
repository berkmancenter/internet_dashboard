Template.UserContentWidget.helpers({
  style: function() {
    const lineHeight = this.widget.pixelDims().height - 60; // minus padding in the CSS
    var backgroundRule = 'background-color: ' + this.backgroundColor + ';';
    if (this.imageUrl) {
      backgroundRule += 'background-image: url("' + this.imageUrl + '"); ' +
        'background-size: cover;';
    }
    const textColorRule = 'color: ' + this.textColor + ';';
    const lineHeightRule = `line-height: ${lineHeight}px;`;
    const fontSizeRule = 'font-size: ' + this.fontSize + 'px;';
    const textAlignHoriRule = 'text-align: ' + this.textAlignHori + ';';
    return {
      style: backgroundRule + ' ' + textColorRule + ' ' + fontSizeRule + ' ' +
        textAlignHoriRule + ' ' + lineHeightRule
    };
  },
  textStyle: function() {
    var textAlignVertRule = 'vertical-align: ' + this.textAlignVert + ';';
    return {
      style: textAlignVertRule
    };
  }
});
