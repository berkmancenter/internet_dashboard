var default_floor = 0.5;

function pairs(str) {
  var output = [], length = str.length - 1, pair;
  str = str.toLowerCase();
  for (var i = 0; i < length; i++) {
    pair = str.substr(i, 2);
    if (!/\s/.test(pair)) {
      output.push(pair);
    }
  }
  return output;
}

function similarity(pairs1, pairs2) {
  var union = pairs1.length + pairs2.length, hits = 0;

  for (var i = 0; i < pairs1.length; i++) {
    for (var j = 0; j < pairs1.length; j++) {
      if (pairs1[i] == pairs2[j]) {
        pairs2.splice(j--, 1);
        hits++;
        break;
      }
    }
  }
  return 2*hits/union || 0;
}

Fuzzy = function(str1, strings, floor){
  var pairs1 = pairs(str1);

  floor = typeof floor == 'number' ? floor : default_floor;

  if (typeof(strings) == 'string') {
    return str1.length > 1 && strings.length > 1 &&
      similarity(pairs1, pairs(strings)) >= floor ||
      str1.toLowerCase() == strings.toLowerCase();
  } else if (strings instanceof Array) {
    var scores = {};

    _.each(strings, function(str2) {
      scores[str2] = str1.length > 1 ?
        similarity(pairs1, pairs(str2)) :
        1*(str1.toLowerCase() == str2.toLowerCase());
    });

    return _.chain(strings).filter(function(str) {
      return scores[str] >= floor;
    }).sort(function(a, b) {
      return scores[b] - scores[a];
    }).value();
  }
};
