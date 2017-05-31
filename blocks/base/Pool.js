define(
[
  'lodash',
  'utils',
  'core/Core',
  'base/Clone'
],
function (_, utils, Core, Clone) {
  'use strict';

  function Pool(stage, model, size) {
    if (!utils.checkBlocksStage(stage)) {
      console.error('Error: Pool needs a base.Stage.');
      return null;
    }
    if (!utils.checkBlock(model)) {
      console.error('Error: Pool needs a model as a base.Block');
      return null;
    }

    Core.call(this);

    this._v.clones = [];
    this._v.model = model;
    this._v.size = (utils.checkNumber(size)) ? size : this._defaults.size;
    this._v.stage = stage;

    stage.addDef(model);
    model.render();

    for (var i = 0, ii = this._v.size; i < ii; i++) {
      this._createClone();
    }
  }

  Pool.prototype = _.create(Core.prototype, {
    'constructor': Pool,

    _defaults: _.defaults({
      clones: null,
      constructorName: 'Pool',
      id: 'pool',
      model: null,
      onStage: false,
      size: 10,
      stage: null
    }, Core.prototype._defaults),


    _createClone: function () {
      var clone = new Clone(this._v.model);
      this._v.clones.push(clone);

      if (this._v.size < this._v.clones.length) {
        this._v.size = this._v.clones.length;
      }

      return clone;
    },

    destroy: function () {
      _.forEachRight(this._v.clones, function (clone) {
        clone.destroy();
        clone = null;
      }, this);
      this._v.clones = null;

      this._v.stage.removeDef(this._v.model);

      return Core.prototype.destroy.call(this);
    },

    getFirstAvailable: function () {
      var first = null;

      _.forEachRight(this._v.clones, function (clone) {
        if (!clone._v.allocated) {
          clone._v.allocated = true;
          first = clone;
          return false;
        }
      }, this);

      if (first !== null) {
        return first;
      }

      first = this._createClone();
      first._v.allocated = true;
      return first;
    }
  });


  return Pool;
});
