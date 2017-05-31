define(
[
  'lodash',
  'utils',
  'core/Core'
],
function (_, utils, Core) {
  'use strict';

  function List() {
    Core.call(this);

    this._v.elements = {};
  }


  List.prototype = _.create(Core.prototype, {
    'constructor': List,

    _defaults: _.defaults({
      constructorName: 'List',
      elements: null,
      id: 'list'
    }, Core.prototype._defaults),


    addElement: function (element) {
      if (utils.checkBlocksCore(element)) {
        if (!this.hasElement(element) && element._v.id !== this._v.id) {
          this._v.elements[element._v.id] = element;
          return element;
        }

        console.warn('List already has element.');
        return null;
      }

      console.error('TypeError: Element to add must be a core.Core.');
      return null;
    },

    clear: function () {
      this._v.elements = {};
    },

    destroy: function () {
      this._v.elements = null;
      return Core.prototype.destroy.call(this);
    },

    getElements: function (key) {
      if (utils.checkString(key)) {
        return this._v.elements[key];
      }

      return this._v.elements;
    },

    hasElement: function (element) {
      if (utils.checkBlocksCore(element)) {
        return _.has(this._v.elements, element._v.id);
      }

      return _.has(this._v.elements, element);
    },

    numElements: function () {
      return _.size(this._v.elements);
    },

    removeElement: function (element) {
      if (utils.checkBlocksCore(element)) {
        if (this.hasElement(element)) {
          delete this._v.elements[element._v.id];
          return element;
        }

        console.warn('List does not have element.');
        return null;
      }

      console.error('TypeError: Element to remove must be a core.Core.');
      return null;
    }
  });


  return List;
});
