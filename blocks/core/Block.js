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

    this.values({
      domClass: (utils.checkValid(domClass)) ? domClass : this._defaults.domClass,
      domId: (utils.checkValid(domId)) ? domId: this.id()
    });

    if (this._defaults.nodeType !== 'use') {
      this.values('node', new Node(this._defaults.nodeType, this.values('domClass'), this.values('domId')));
    }
  }

  Block.prototype = _.create(Core.prototype, {
    'constructor': Block,

    _defaults: _.defaults({
      active: false,
      anchorMode: utils.ANCHOR_MODE.AUTO,
      anchorX: 0,
      anchorY: 0,
      children: null,
      constructorName: 'Block',
      currentTarget: null,
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
      this.addChildren(child);
    },

    addChildren: function () {
      var children = _.flatten(arguments);

      if (_.isNull(this.values('children'))) {
        this.values('children', new List()); // make a List
      }

      _.forEach(children, function (child) {
        if (utils.checkBlock(child)) {
          if (child.id() !== this.id()) {
            this.values('children').addElement(child);
            child.values({
              active: true,
              parent: this,
              root: utils.checkBlocksStage(this) ? this : this.values('root')
            });

            if (!_.isNull(child.values('root'))) {
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
        this.values({
          anchorMode: utils.ANCHOR_MODE.MANUAL,
          anchorX: x,
          anchorY: y
        });
        return this;
      }

      if (_.isUndefined(x)) {
        return [this.values('anchorX'), this.values('anchorY')];
      }

      console.error('Error: Could not set anchor.');
      return null;
    },

    appendTo: function (target) {
      if (utils.checkBlocksNode(target)) {
        this.values('node').appendTo(target);
        this.values('currentTarget', target);
        return this;
      }

      console.error('TypeError: Block Node can only be appended to a core.Node.');
      return null;
    },

    _assignValueToChildren: function (prop) {
      _.forEach(this.getChildren(), function (child) {
        child.values(prop, this.values(prop));
        child._assignValueToChildren(prop);
      }, this);
    },

    _bindValuesToNodeAttributes: function () {
      var attributes = _.pick(this.values(), this._bindAttributes);
      _.forEach(attributes, function (value, key) {
        this.values('node').setAttributes(key, value);
      }, this);
    },

    _calculateBounds: function () {
      var height = 0;
      var width = 0;

      if (this.numChildren() === 0) {
        var bbox = this.values('node').getBBox();
        height = bbox.height;
        width = bbox.width;
      }
      else {
        var x1 = Math.pow(10, 9);
        var x2 = 0;
        var y1 = Math.pow(10, 9);
        var y2 = 0;

        _.forEach(this.getChildren(), function (child) {
          if (child.values('x') < x1) {
            x1 = child.values('x');
          }
          if (child.values('x') + child.values('width') > x2) {
            x2 = child.values('x') + child.values('width');
          }
          if (child.values('y') < y1) {
            y1 = child.values('y');
          }
          if (child.values('y') + child.values('height') > y2) {
            y2 = child.values('y') + child.values('height');
          }
        }, this);

        height = y2 - y1;
        width = x2 - x1;
      }

      this.values({
        height: height * this.values('scale'),
        width: width * this.values('scale')
      });

      if (this.values('anchorMode') === utils.ANCHOR_MODE.AUTO) {
        this.values({
          anchorX: width / 2,
          anchorY: height / 2
        });
      }
    },

    detachFrom: function (target) {
      if (utils.checkBlocksNode(target)) {
        this.values('node').detachFrom(target);
        this.values('currentTarget', null);
        return this;
      }

      console.error('TypeError: Block Node can only be detached from a core.Node.');
      return null;
    },

    destroy: function () {
      this.values('node').destroy();

      if (!_.isNull(this.values('parent'))) {
        this.values('parent').removeChildren(this);
      }

      this.removeChildren();

      this.values({
        children: null,
        node: null,
        parent: null
      });

      return Core.prototype.destroy.call(this);
    },

    dirty: function (value) {
      if (utils.checkBoolean(value)) {
        this._v.dirty = value;

        if (value && this.values('parent') !== null) {
          this.values('parent').dirty(true);
        }
      }

      return this._v.dirty;
    },

    _dropChild: function (child) {
      this.values('children').removeElement(child);
      child.values({
        active: false,
        parent: null,
        onStage: false,
        root: null
      });
    },

    getChildren: function (id) {
      if (_.isNull(this.values('children'))) {
        return null;
      }

      if (_.isString(id)) {
        return this.values('children').getElements(id);
      }

      return this.values('children').getElements();
    },

    getNode: function () {
      return this.values('node').getNode();
    },

    hasChild: function (child) {
      if (_.isNull(this.values('children'))) {
        return false;
      }
      return this.values('children').hasChild(child);
    },

    _hitTestRootBounds: function () {
      var root = this.values('root');

      var strokeSize = (this.values('stroke')) ?
        this.values('stroke-width') * this.values('scale') : 0;

      var aX = this.values('width') / 2;
      var aY = this.values('height') / 2;

      var x1 = this.values('globalX') - aX - strokeSize;
      var x2 = this.values('globalX') + aX;
      var y1 = this.values('globalY') - aY - strokeSize;
      var y2 = this.values('globalY') + aY;

      var px1 = root.values('x');
      var px2 = root.values('x') + root.values('width');
      var py1 = root.values('y');
      var py2 = root.values('y') + root.values('height');

      if (x1 > px2 || x2 < px1 || y1 > py2 || y2 < py1) {
        this.values('visible', false);
      }
      else {
        this.values('visible', true);
      }
    },

    numChildren: function () {
      if (_.isNull(this.values('children'))) {
        return 0;
      }
      return this.values('children').numElements();
    },

    _preRender: function () {
      if (_.isNull(this.values('children'))) {
        return;
      }

      // add or remove children from render node:
      _.forEach(this.getChildren(), function (child) {
        if (child.values('active') && !child.values('onStage')) {
          child.appendTo(this.values('node'));
          child.values('onStage', true);
        }
        else if (!child.values('active') && child.values('onStage')) {
          child.detachFrom(this.values('node'));
          child.values('onStage', false);
          this.values('children').removeElement(child);
        }
      }, this);
    },

    _postRender: function () {
      this._renderTransforms();

      if (!_.isNull(this.values('parent'))) {
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
            if (this.values('children').hasElement(child)) {
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
      if (this.values('active') && this.values('onStage')) {
        this._preRender();

        if (this.values('visible') && this.values('dirty')) {
          if (!_.isNull(this.values('children'))) {
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
      var newX = this.values('x');
      var newY = this.values('y');

      if (this.values('anchorMode') === utils.ANCHOR_MODE.AUTO) {
        newX -= this.values('width') / 2;
        newY -= this.values('height') / 2;
      }

      this.values('transform', utils.writeSvgTransform({
        'translate': [newX, newY],
        'scale': [this.values('scale')],
        'rotate': [this.values('rotate'), this.values('anchorX'), this.values('anchorY')]
      }));

      this.values('node').setAttributes('transform', this.values('transform'));
    },

    _setGlobalXY: function () {
      var parent = this.values('parent');

      this.values({
        globalX: parent.values('globalX') + this.values('x'),
        globalY: parent.values('globalY') + this.values('y')
      });
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
