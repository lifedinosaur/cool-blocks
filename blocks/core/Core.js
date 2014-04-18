define(
[
  'lodash',
  'blocks/utils'
],
function (_, utils) {
  'use strict';

  function Core() {
    Object.call(this);

    this._v = _.defaults({
      id: _.uniqueId(this._defaults.id)
    }, this._defaults);
  }


  Core.prototype = _.create(Object.prototype, {
    'constructor': Core,

    _defaults: {
      id: 'core'
    },

    destroy: function () {
      this._v = null;
      return this;
    },

    id: function (newId) {
      return this.values('id', newId);
    },

    getConstructorName: function() {
      var funcNameRegex = /function (.{1,})\(/;
      var results = (funcNameRegex).exec((this).constructor.toString());

      return (results && results.length > 1) ? results[1] : '';
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
  });


  return Core;
});
