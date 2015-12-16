var Adapter, SequelizeAdapter,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Adapter = require('../adapter');

SequelizeAdapter = (function(superClass) {
  extend(SequelizeAdapter, superClass);

  function SequelizeAdapter() {
    return SequelizeAdapter.__super__.constructor.apply(this, arguments);
  }

  SequelizeAdapter.get = function(model, key) {
    if (model != null) {
      return model.get(key);
    }
  };

  return SequelizeAdapter;

})(Adapter);

module.exports = SequelizeAdapter;
