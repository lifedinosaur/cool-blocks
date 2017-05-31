define(
[
  'lodash',
  'utils',
  'core/Core'
],
function (_, utils, Core) {
  'use strict';

  function Node(type, domClass, domId, cloneId) {
    if (_.isUndefined(type)) {
      console.error('Error: Node type must be defined.');
      return null;
    }

    type = type.toLowerCase();
    if (!utils.checkSVG(type)) {
      console.error('Error: Invalid SVG node type.');
      return null;
    }

    if (type === 'use' && !utils.checkString(cloneId)) {
      console.error('Error: A use type must have a cloneId.');
      return null;
    }

    Core.call(this);

    this._v.domClass = (utils.checkValid(domClass)) ? domClass : type;
    this._v.domElement = (type === 'use') ? utils.createSvgUseNode(cloneId) : utils.createSvgNode(type);
    this._v.domId = (utils.checkValid(domId)) ? domId : this._v.id;
    this._v.type = type;

    this.setAttributes({
      id: this._v.domId,
      class: this._v.domClass
    });
  }


  Node.prototype = _.create(Core.prototype, {
    'constructor': Node,

    _defaults: _.defaults({
      constructorName: 'Node',
      currentTarget: null,
      domClass: 'node',
      domElement: null,
      domId: 'node',
      id: 'node',
      type: 'node'
    }, Core.prototype._defaults),


    appendTo: function (target) {
      if (utils.checkBlocksNode(target)) {
        target.getDomElement().appendChild(this._v.domElement);
        this._v.currentTarget = target;

        return this;
      }

      if (utils.checkHTML(target)) {
        target.appendChild(this._v.domElement);
        this._v.currentTarget = target;
        return this;
      }

      console.error('TypeError: Node can only be appended to a core.Node.');
      return null;
    },

    destroy: function () {
      if (!_.isNull(this._v.currentTarget)) {
        this.detachFrom(this._v.currentTarget);
      }
      this._v.domElement = null;
      return Core.prototype.destroy.call(this);
    },

    detachFrom: function (target) {
      if (utils.checkBlocksNode(target)) {
        target.getDomElement().removeChild(this._v.domElement);
        this._v.currentTarget = null;
        return this;
      }

      if (utils.checkHTML(target)) {
        target.removeChild(this._v.domElement);
        this._v.currentTarget = null;
        return this;
      }

      console.error('TypeError: Node can only be detached from a core.Node.');
      return null;
    },

    getBBox: function () {
      return this._v.domElement.getBBox();
    },

    getDomElement: function () {
      return this._v.domElement;
    },

    setAttribute: function (key, value) {
      return this.setAttributes(key, value);
    },

    setAttributes: function (key, value) {
      if (utils.checkString(key)) {
        if (_.isUndefined(value)) {
          return this._v.domElement.getAttribute(key);
        }

        this._v.domElement.setAttribute(key, value);
        return this;
      }

      if (_.isObject(key)) {
          _.forEach(key, function (v, k) {
            this._v.domElement.setAttribute(k, v);
          }, this);

          return this;
      }

      console.error('Error: Invalid key. Could not set attribute.');
      return null;
    }
  });


  return Node;
});
