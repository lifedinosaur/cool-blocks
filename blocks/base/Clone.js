define(
[
  'lodash',
  'utils',
  'core/Block',
  'core/Node'
],
function (_, utils, Block, Node) {
  'use strict';

  function Clone(model, domClass, domId) {
    Block.call(this, domClass, domId);

    this._v.node = new Node(this._defaults.nodeType, this._v.domClass, this._v.domId, model._v.domId);
  }

  Clone.prototype = _.create(Block.prototype, {
    'constructor': Clone,

    _defaults: _.defaults({
      allocated: false,
      constructorName: 'Clone',
      domClass: 'clone',
      domId: 'clone',
      id: 'clone',
      nodeType: 'use'
    }, Block.prototype._defaults),

    detachFrom: function (target) {
      this._v.allocated = false;
      return Block.prototype.detachFrom.call(this, target);
    }
  });

  return Clone;
});
