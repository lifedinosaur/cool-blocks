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

    this.values('node', new Node(
      this._defaults.nodeType, this.values('domClass'),
      this.values('domId'), model.values('domId')));
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
      this.values('allocated', false);
      return Block.prototype.detachFrom.call(this, target);
    }
  });

  return Clone;
});
