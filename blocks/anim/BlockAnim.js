define(
[
  'lodash',
  'utils',
  'anim/Anim'
],
function (_, utils, Anim) {
  'use strict';

  function BlockAnim(block, options) {
    Anim.call(this, options);

    this._v.bindKeys = [];
    this._v.block = block;

    _.forEach(options, function (value, key) {
      if (!_.isUndefined(block._v[key])) {
        this._v.bindKeys.push(key);
        this._v[key] = block._v[key];
      }
    }, this);
  }

  BlockAnim.prototype = _.create(Anim.prototype, {
    'constructor': BlockAnim,

    _defaults: _.defaults({
      bindKeys: null,
      block: null,
      constructorName: 'BlockAnim',
      id: 'block-anim'
    }, Anim.prototype._defaults),

    _createTweenOptions: function (options) {
      var tweenOptions = Anim.prototype._createTweenOptions.call(this, options);
      tweenOptions.onUpdate = this._onUpdateInternal;

      return tweenOptions;
    },

    destroy: function () {
      this._v.bindKeys = null;
      this._v.block = null;

      Anim.prototype.destroy.call(this);
    },

    _onUpdateInternal: function (self) {
      _.forEach(self._v.bindKeys, function (key) {
        self._v.block._v[key] = self._v[key];
      });
      self._v.block.dirty(true);

      var update = self._v.onUpdate;
      if(!_.isUndefined(update)) {
        update(self);
      }
    }
  });

  return BlockAnim;
});
