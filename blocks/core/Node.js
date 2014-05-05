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

    this.values({
      domClass: (utils.checkValid(domClass)) ? domClass : type,
      domId: (utils.checkValid(domId)) ? domId: this.id(),
      node: (type === 'use') ? utils.createSvgUseNode(cloneId) : utils.createSvgNode(type),
      type: type
    });

    this.setAttributes({
      id: this.values('domId'),
      class: this.values('domClass')
    });
  }


  Node.prototype = _.create(Core.prototype, {
    'constructor': Node,

    _defaults: _.defaults({
      constructorName: 'Node',
      currentTarget: null,
      domClass: 'node',
      domId: 'node',
      id: 'node',
      node: null,
      type: 'node'
    }, Core.prototype._defaults),


    appendTo: function (target) {
      if (utils.checkBlocksNode(target)) {
        target.getNode().appendChild(this.values('node'));
        this.values('currentTarget', target);
        return this;
      }

      if (utils.checkHTML(target)) {
        target.appendChild(this.values('node'));
        this.values('currentTarget', target);
        return this;
      }

      console.error('TypeError: Node can only be appended to a core.Node.');
      return null;
    },

    destroy: function () {
      if (!_.isNull(this.values('currentTarget'))) {
        this.detachFrom(this.values('currentTarget'));
      }
      this.values({
        node: null
      });
      return Core.prototype.destroy.call(this);
    },

    detachFrom: function (target) {
      if (utils.checkBlocksNode(target)) {
        target.getNode().removeChild(this.values('node'));
        this.values('currentTarget', null);
        return this;
      }

      if (utils.checkHTML(target)) {
        target.removeChild(this.values('node'));
        this.values('currentTarget', null);
        return this;
      }

      console.error('TypeError: Node can only be detached from a core.Node.');
      return null;
    },

    getBBox: function () {
      return this.values('node').getBBox();
    },

    getNode: function () {
      return this.values('node');
    },

    setAttributes: function (key, value) {
      if (utils.checkString(key)) {
        if (_.isUndefined(value)) {
          return this.values('node').getAttribute(key);
        }

        this.values('node').setAttribute(key, value);
        return this;
      }

      if (_.isObject(key)) {
          _.forEach(key, function (v, k) {
            this.values('node').setAttribute(k, v);
          }, this);

          return this;
      }

      console.error('Error: Invalid key. Could not set attribute.');
      return null;
    }
  });


  return Node;
});
