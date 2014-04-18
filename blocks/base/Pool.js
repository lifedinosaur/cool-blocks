define(
[
  'lodash',
  'blocks/utils',
  'blocks/core/Core',
  'blocks/base/Clone'
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

    this.values({
      clones: [],
      model: model,
      size: (utils.checkNumber(size)) ? size : this._defaults.size,
      stage: stage
    });

    model
      .values({
        active: true,
        onStage: true
      })
      .appendTo(stage.values('defs'))
      .render();

    for (var i = 0, ii = this.values('size'); i < ii; i++) {
      this._createClone();
    }
  }

  Pool.prototype = _.create(Core.prototype, {
    'constructor': Pool,

    _defaults: _.defaults({
      clones: null,
      id: 'pool',
      model: null,
      size: 10,
      stage: null
    }, Core.prototype._defaults),

    _createClone: function () {
      var clone = new Clone(this.values('model'));
      this.values('clones').push(clone);

      if (this.values('size') < this.values('clones').length) {
        this.values('size', this.values('clones'.length));
      }

      return clone;
    },

    destroy: function () {
      _.forEachRight(this.values('clones'), function (clone) {
        clone.destroy();
        clone = null;
      }, this);

      this.values('model')
        .values({
          active: false,
          onStage: false
        })
        .detachFrom(this.values('stage').values('defs'));

      this.values({
        clones: null
      });

      return Core.prototype.destroy.call(this);
    },

    getFirstAvailable: function () {
      var first = null;

      _.forEachRight(this.values('clones'), function (clone) {
        if (!clone.values('allocated')) {
          clone.values('allocated', true);
          first = clone;
          return false;
        }
      }, this);

      if (first !== null) {
        return first;
      }

      first = this._createClone().values('allocated', true);
      return first;
    }
  });


  return Pool;
});
