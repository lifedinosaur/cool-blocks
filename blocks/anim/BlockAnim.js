define(
[
  'lodash',
  'blocks/utils',
  'blocks/anim/Anim'
],
function (_, utils, Anim) {
  'use strict';

  function BlockAnim(block, options) {
    Anim.call(this, options);

    this.values({
      block: block,
      bindKeys: []
    });

    _.forEach(options, function (value, key) {
      if (!_.isUndefined(block.values(key))) {
        this.values('bindKeys').push(key);
        this.values(key, block.values(key));
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
      this.values({
        bindKeys: null,
        block: null
      });
      Anim.prototype.destroy.call(this);
    },

    _onUpdateInternal: function (self) {
      _.forEach(self.values('bindKeys'), function (key) {
        self.values('block').values(key, self.values(key));
      });

      var update = self.values('onUpdate');
      if(!_.isUndefined(update)) {
        update(self);
      }
    }
  });

  return BlockAnim;
});
