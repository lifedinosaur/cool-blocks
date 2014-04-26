define(
[
  'lodash',
  'blocks/utils',
  'blocks/core/Block',
  'blocks/core/Node'
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

      if (this.values('anchorMode') === utils.ANCHOR_MODE.AUTO) {
        this.values('rect').setAttributes({
          height: this.values('height'),
          width: this.values('width')
        });
      }
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
