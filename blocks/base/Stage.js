define(
[
  'lodash',
  'utils',
  'core/Block',
  'core/Node'
],
function (_, utils, Block, Node) {
  'use strict';

  function Stage(container, domClass, domId) {
    if (!utils.checkHTML(container)) {
      console.error('TypeError: Stage container must be an HTML node.');
      return null;
    }

    Block.call(this, domClass, domId);

    this._v.container = container;
    this._v.defs = new Node('defs', 'stage-defs', 'stage-defs');

    this._v.defs.appendTo(this._v.node);
    this._v.node.appendTo(container);  // add stage svg node to container
  }

  Stage.prototype = _.create(Block.prototype, {
    'constructor': Stage,

    _defaults: _.defaults({
      anchorMode: utils.ANCHOR_MODE.MANUAL,
      active: true,
      constructorName: 'Stage',
      container: null,
      defs: null,
      id: 'stage',
      onStage: true,
      nodeType: 'svg'
    }, Block.prototype._defaults),

    _preframe: false,
    _preframeEnabled: false,


    addDef: function (def) {
      def.appendTo(this._v.defs);
      def._v.active = true;
      def._v.onStage = true;
      def._v.parent = this;
      def._v.root = this;
    },

    _calculateBounds: function () {
      this._v.height = this._v.container.offsetHeight;
      this._v.width = this._v.container.offsetWidth;
    },

    destroy: function () {
      this._v.defs.destroy();
      this._v.defs = null;

      return Block.prototype.destroy.call(this);
    },

    enablePreframe: function () {
      this._preframe = true;
      this._preframeEnabled = true;
    },

    removeDef: function (def) {
      def.detachFrom(this._v.defs);
      def._v.active = false;
      def._v.onStage = false;
      def._v.parent = null;
      def._v.root = null;
    },

    render: function () {
      if (this._preframeEnabled && this._preframe) {
        this.getDomElement().style.visibility = 'hidden';
      }

      Block.prototype.render.call(this);

      if (this._preframeEnabled) {
        if (!this._preframe && this.getDomElement().style.visibility === 'hidden') {
          this.getDomElement().style.visibility = 'visible';
          this._preframeEnabled = false;
        }
        this._preframe = false;
      }

      return this;
    }
  });

  return Stage;
});
