define(
[
  'lodash',
  'utils',
  'core/Core',
  'core/List',
  'core/Node'
],
function (_, utils, Core, List, Node) {
  'use strict';

  function Block(domClass, domId) {
    Core.call(this);

    this._v.domClass = (utils.checkValid(domClass)) ? domClass : this._defaults.domClass;
    this._v.domId = (utils.checkValid(domId)) ? domId: this._v.id;

    if (this._defaults.nodeType !== 'use') {
      this._v.node = new Node(
        this._defaults.nodeType,
        this._v.domClass,
        this._v.domId
      );
    }
  }

  Block.prototype = _.create(Core.prototype, {
    'constructor': Block,

    _defaults: _.defaults({
      active: false,
      anchorMode: utils.ANCHOR_MODE.AUTO,
      anchorX: 0,
      anchorY: 0,
      bounds: [0, 0, 0, 0],
      children: null,
      constructorName: 'Block',
      dirty: true,
      domClass: 'g',
      domId: 'g',
      fill: undefined,
      'fill-opacity': undefined,
      globalX: 0,
      globalY: 0,
      height: 0,
      id: 'block',
      node: null,
      nodeType: 'g',
      onStage: false,
      parent: null,
      root: null,
      rotate: 0,
      scale: 1,
      stroke: undefined,
      'stroke-opacity': undefined,
      'stroke-width': undefined,
      transform: undefined,
      visible: true,
      width: 0,
      x: 0,
      y: 0
    }, Core.prototype._defaults),

    _bindAttributes: [
      'fill', 'fill-opacity', 'stroke', 'stroke-opacity', 'stroke-width'
    ],

    _dirtyAttributes: [
      'anchorMode', 'anchorX', 'anchorY', 'fill', 'fill-opacity', 'stroke',
      'stroke-opacity', 'stroke-width', 'rotate', 'scale', 'x', 'y'
    ],


    addChild: function (child) {
      return this.addChildren(child);
    },

    addChildren: function () {
      var children = _.flatten(arguments);

      if (_.isNull(this._v.children)) {
        this._v.children = new List(); // make a List
      }

      _.forEach(children, function (child) {
        if (utils.checkBlock(child)) {
          if (child._v.id !== this._v.id) {
            this._v.children.addElement(child);

            child._v.active = true;
            child._v.parent = this;
            child._v.root = utils.checkBlocksStage(this) ? this : this._v.root;

            if (!_.isNull(child._v.root)) {
              child._assignValueToChildren('root'); // pass root stage to all children
            }

            this.dirty(true);
          }
          else {
            console.warn('Could not add child.');
          }
        }
        else {
          console.error('TypeError: Child to add must be a core.Block.');
          return null;
        }
      }, this);

      return this;
    },

    anchor: function (x, y) {
      if (utils.checkNumber(x) && utils.checkNumber(y)) {

        this._v.anchorMode = utils.ANCHOR_MODE.MANUAL;
        this._v.anchorX = x;
        this._v.anchorY = y;

        this.dirty(true);

        return this;
      }

      if (_.isUndefined(x)) {
        return [this._v.anchorX, this._v.anchorY];
      }

      console.error('Error: Could not set anchor.');
      return null;
    },

    appendTo: function (target) {
      if (utils.checkBlocksNode(target)) {
        this._v.node.appendTo(target);
        return this;
      }

      console.error('TypeError: Block Node can only be appended to a core.Node.');
      return null;
    },

    _assignValueToChildren: function (prop) {
      _.forEach(this.getChildren(), function (child) {
        child._v[prop] = this._v[prop];

        child._assignValueToChildren(prop);
      }, this);
    },

    _bindValuesToNodeAttributes: function () {
      var attributes = _.pick(this._v, this._bindAttributes);
      _.forEach(attributes, function (value, key) {
        this._v.node.setAttributes(key, value);
      }, this);
    },

    _calculateBounds: function () {
      var height = 0;
      var width = 0;
      var x = 0;
      var y = 0;

      if (this.numChildren() === 0) {
        var bbox = this._v.node.getBBox();
        height = bbox.height;
        width = bbox.width;
        x = bbox.x;
        y = bbox.y;
      }
      else {
        var x1 = Math.pow(10, 9);
        var x2 = Math.pow(10, -9);
        var y1 = Math.pow(10, 9);
        var y2 = Math.pow(10, -9);

        _.forEach(this.getChildren(), function (child) {
          var bounds = child._v.bounds;
          var childX = child._v.x + bounds[0];
          var childY = child._v.y + bounds[1];

          if (childX < x1) {
            x1 = childX;
          }
          if (childX + bounds[2] > x2) {
            x2 = childX + bounds[2];
          }
          if (childY < y1) {
            y1 = childY;
          }
          if (childY + bounds[3] > y2) {
            y2 = childY + bounds[3];
          }
        }, this);

        height = y2 - y1;
        width = x2 - x1;
        x = x1;
        y = y1;
      }

      this._v.bounds = [x, y, width, height];
      this._v.height = height * this._v.scale;
      this._v.width = width * this._v.scale;

      if (this._v.anchorMode === utils.ANCHOR_MODE.AUTO) {
        this._v.anchorX = width / 2;
        this._v.anchorY = height / 2;
      }
    },

    detachFrom: function (target) {
      if (utils.checkBlocksNode(target)) {
        this._v.node.detachFrom(target);
        return this;
      }

      console.error('TypeError: Block Node can only be detached from a core.Node.');
      return null;
    },

    destroy: function () {
      this._v.node.destroy();

      if (!_.isNull(this._v.parent)) {
        this._v.parent.removeChildren(this);
      }

      this.removeChildren();

      this._v.children = null;
      this._v.node = null;
      this._v.parent = null;

      return Core.prototype.destroy.call(this);
    },

    dirty: function (value) {
      if (utils.checkBoolean(value)) {
        this._v.dirty = value;

        if (value && this._v.parent !== null) {
          this._v.parent.dirty(true);
        }
      }

      return this._v.dirty;
    },

    _dropChild: function (child) {
      this._v.children.removeElement(child);

      child._v.active = false;
      child._v.parent = null;
      child._v.onStage = false;
      child._v.root = null;
    },

    getChildren: function (id) {
      if (_.isNull(this._v.children)) {
        return null;
      }

      if (_.isString(id)) {
        return this._v.children.getElements(id);
      }

      return this._v.children.getElements();
    },

    getDomElement: function () {
      return this._v.node.getDomElement();
    },

    hasChild: function (child) {
      if (_.isNull(this._v.children)) {
        return false;
      }
      return this._v.children.hasChild(child);
    },

    _hitTestRootBounds: function () {
      var root = this._v.root;

      var strokeSize = (this._v.stroke) ?
        this._v['stroke-width'] * this._v.scale : 0;

      var aX = this._v.width / 2;
      var aY = this._v.height / 2;

      var x1 = this._v.globalX - aX - strokeSize;
      var x2 = this._v.globalX + aX;
      var y1 = this._v.globalY - aY - strokeSize;
      var y2 = this._v.globalY + aY;

      var px1 = root._v.x;
      var px2 = root._v.x + root._v.width;
      var py1 = root._v.y;
      var py2 = root._v.y + root._v.height;

      if (x1 > px2 || x2 < px1 || y1 > py2 || y2 < py1) {
        this._v.visible = false;
      }
      else {
        this._v.visible = true;
      }
    },

    numChildren: function () {
      if (_.isNull(this._v.children)) {
        return 0;
      }
      return this._v.children.numElements();
    },

    _preRender: function () {
      if (_.isNull(this._v.children)) {
        return;
      }

      // add or remove children from render node:
      _.forEach(this.getChildren(), function (child) {
        if (child._v.active && !child._v.onStage) {
          child.appendTo(this._v.node);
          child._v.onStage = true;
        }
        else if (!child._v.active && child._v.onStage) {
          child.detachFrom(this._v.node);
          child._v.onStage = false;
          this._v.children.removeElement(child);
        }
      }, this);
    },

    _postRender: function () {
      this._renderTransforms();

      if (!_.isNull(this._v.parent)) {
        this._setGlobalXY();
        //this._hitTestRootBounds();
      }

      this.dirty(false);
    },

    removeChild: function (child) {
      this.removeChildren(child);
    },

    removeChildren: function () {
      var children = _.flatten(arguments);

      if (arguments.length > 0) {
        _.forEach(children, function (child) {
          if (utils.checkBlock(child)) {
            if (this._v.children.hasElement(child)) {
              this._dropChild(child);
              this.dirty(true);
            }
            else {
              console.warn('Could not remove child.');
            }
          }
          else {
            console.error('TypeError: Child to remove must be a core.Block.');
            return null;
          }
        }, this);
      }
      else {
        if (this.numChildren() > 0) {
          _.forEach(this.getChildren(), function (child) {
            this._dropChild(child);
            this.dirty(true);
          }, this);
        }
      }

      return this;
    },

    render: function () {
      if (this._v.active && this._v.onStage) {
        this._preRender();

        if (this._v.visible && this._v.dirty) {
          if (!_.isNull(this._v.children)) {
            _.forEachRight(this.getChildren(), function (child) {
              child.render();
            }, this);
          }

          this._bindValuesToNodeAttributes();

          this._calculateBounds();

          this._postRender();

          return this;
        }
      }

      return null;
    },

    _renderTransforms: function () {
      var newX = this._v.x;
      var newY = this._v.y;

      if (this._v.anchorMode === utils.ANCHOR_MODE.AUTO) {
        newX -= this._v.width / 2;
        newY -= this._v.height / 2;
      }

      this._v.transform = utils.writeSvgTransform({
        'translate': [newX, newY],
        'scale': [this._v.scale],
        'rotate': [this._v.rotate, this._v.anchorX, this._v.anchorY]
      });

      this._v.node.setAttributes('transform', this._v.transform);
    },

    _setGlobalXY: function () {
      var parent = this._v.parent;

      this._v.globalX = parent._v.globalX + this._v.x;
      this._v.globalY = parent._v.globalY + this._v.y;
    },

    values: function (key, value) {
      if (utils.checkString(key) && !_.isUndefined(value)) {
        if (_.indexOf(this._dirtyAttributes, key) > -1) {
          this.dirty(true);
        }
      }

      if (_.isObject(key)) {
          _.forEach(key, function (v, k) {
            if (_.indexOf(this._dirtyAttributes, k) > -1) {
              this.dirty(true);
              return false;
            }
          }, this);
      }

      return Core.prototype.values.call(this, key, value);
    }
  });

  return Block;
});
