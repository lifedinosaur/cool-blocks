define(
[
  'lodash',
  'utils'
],
function (_, utils) {
  'use strict';

  function Core() {
    this._v = _.defaults({
      id: _.uniqueId(this._defaults.id)
    }, this._defaults);
  }


  Core.prototype = {
    'constructor': Core,

    _defaults: {
      constructorName: 'Core',
      id: 'core'
    },

    destroy: function () {
      this._v = null;
      return this;
    },

    getConstructorName: function() {
      return this._v.constructorName;
    },

    values: function (key, value) {
      if (utils.checkString(key)) {
        if (_.isUndefined(value)) {
          return this._v[key];
        }

        this._v[key] = value;
        return this;
      }

      if (_.isObject(key)) {
          _.forEach(key, function (v, k) {
            this._v[k] = v;
          }, this);

          return this;
      }

      return this._v;
    }
  };


  return Core;
});
