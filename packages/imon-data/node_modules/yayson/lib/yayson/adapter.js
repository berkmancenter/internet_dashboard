var Adapter;

Adapter = (function() {
  function Adapter() {}

  Adapter.get = function(model, key) {
    if (key) {
      return model[key];
    }
    return model;
  };

  Adapter.id = function(model) {
    return "" + (this.get(model, 'id'));
  };

  return Adapter;

})();

module.exports = Adapter;
