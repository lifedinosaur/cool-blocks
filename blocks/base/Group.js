define(
[
  'lodash',
  'utils',
  'core/Block',
  'core/Node'
],
function (_, utils, Block, Node) {
  'use strict';

  function Group(domClass, domId) {
    Block.call(this, domClass, domId);

    this._v.rect = new Node('rect', 'control-rect', this._v.id + '-control-rect')
      .setAttributes({
        fill: 'transparent'
      })
      .appendTo(this._v.node);
  }

  Group.prototype = _.create(Block.prototype, {
    'constructor': Group,

    _defaults: _.defaults({
      anchorMode: utils.ANCHOR_MODE.MANUAL,
      constructorName: 'Group',
      id: 'group',
      rect: null
    }, Block.prototype._defaults),


    _calculateBounds: function () {
      Block.prototype._calculateBounds.call(this);

      var bounds = this._v.bounds;
      this._v.rect.setAttributes({
        height: bounds[3],
        width: bounds[2],
        x: bounds[0],
        y: bounds[1]
      });
    },

    destroy: function () {
      this._v.rect.destroy();
      this._v.rect = null;

      return Block.prototype.destroy.call(this);
    }
  });

  return Group;
});
