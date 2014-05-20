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

    this.values('rect',
      new Node('rect', 'control-rect', this.id() + '-control-rect')
        .setAttributes({
          fill: 'transparent'
        })
        .appendTo(this.values('node'))
    );
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

      var bounds = this.values('bounds');
      this.values('rect').setAttributes({
        height: bounds[3],
        width: bounds[2],
        x: bounds[0],
        y: bounds[1]
      });
    },

    destroy: function () {
      this.values('rect').destroy();

      this.values({
        rect: null
      });

      return Block.prototype.destroy.call(this);
    }
  });

  return Group;
});
