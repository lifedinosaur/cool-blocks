define(
[
  'lodash',
  'blocks/utils',
  'blocks/core/Block',
  'blocks/core/Node'
],
function (_, utils, Block, Node) {
  'use strict';

  function Stage(container, domClass, domId) {
    if (!utils.checkHTML(container)) {
      console.error('TypeError: Stage container must be an HTML node.');
      return null;
    }

    Block.call(this, domClass, domId);

    this.values({
      container: container,
      defs: new Node('defs', 'stage-defs', 'stage-defs')
    });
    this.values('defs').appendTo(this.values('node'));
    this.values('node').appendTo(container);  // add stage svg node to container
  }

  Stage.prototype = _.create(Block.prototype, {
    'constructor': Stage,

    _defaults: _.defaults({
      anchorMode: utils.ANCHOR_MODE.MANUAL,
      active: true,
      container: null,
      defs: null,
      id: 'stage',
      onStage: true,
      nodeType: 'svg'
    }, Block.prototype._defaults),


    _calculateBounds: function () {
      this.values({
        height: this.values('container').offsetHeight,
        width: this.values('container').offsetWidth
      });
    },

    destroy: function () {
      this.values('defs').destroy();

      this.values({
        defs: null
      });

      return Block.prototype.destroy.call(this);
    }
  });

  return Stage;
});
