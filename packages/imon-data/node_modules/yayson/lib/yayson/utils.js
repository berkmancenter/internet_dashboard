module.exports = function(_, Q) {
  var utils;
  if (_ == null) {
    _ = {};
  }
  if (Q == null) {
    Q = {};
  }
  return utils = {
    find: _.find || function(arr, callback) {
      var elem, i, len;
      for (i = 0, len = arr.length; i < len; i++) {
        elem = arr[i];
        if (callback(elem)) {
          return elem;
        }
      }
      return void 0;
    },
    filter: _.filter || function(arr, callback) {
      var elem, i, len, res;
      res = [];
      for (i = 0, len = arr.length; i < len; i++) {
        elem = arr[i];
        if (callback(elem)) {
          res.push(elem);
        }
      }
      return res;
    },
    values: _.values || function(obj) {
      if (obj == null) {
        obj = {};
      }
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    },
    clone: _.clone || function(obj) {
      var clone, key, val;
      if (obj == null) {
        obj = {};
      }
      clone = {};
      for (key in obj) {
        val = obj[key];
        clone[key] = val;
      }
      return clone;
    },
    any: _.any || function(arr, callback) {
      return utils.find(arr, callback) != null;
    },
    isPromise: Q.isPromise || function(obj) {
      return obj === Object(obj) && typeof obj.promiseDispatch === "function" && typeof obj.inspect === "function";
    }
  };
};
