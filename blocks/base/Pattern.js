define(
[
  'lodash',
  'utils',
  'core/Block',
  'core/Node'
],
function (_, utils, Block, Node) {
  'use strict';

  function Pattern(domClass, domId) {
    Block.call(this, domClass, domId);

    this._v.node = new Node(this._defaults.nodeType, this._v.domClass, this._v.domId);
    this._v.node.setAttributes({
      patternUnits: 'userSpaceOnUse'
    });
  }

  Pattern.prototype = _.create(Block.prototype, {
    'constructor': Pattern,

    _defaults: _.defaults({
      anchorMode: utils.ANCHOR_MODE.MANUAL,
      constructorName: 'Pattern',
      domClass: 'pattern',
      domId: 'pattern',
      id: 'pattern',
      nodeType: 'pattern'
    }, Block.prototype._defaults),


    fill: function () {
      return 'url(#' + this._v.domId + ')';
    },

    render: function () {
      Block.prototype.render.call(this);

      this._v.node.setAttributes({
        height: this._v.height,
        width: this._v.width,
        x: this._v.x,
        y: this._v.y
      });

      return this;
    }
  });

  return Pattern;
});
