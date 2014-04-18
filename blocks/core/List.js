define(
[
  'lodash',
  'blocks/utils',
  'blocks/core/Core'
],
function (_, utils, Core) {
  'use strict';

  function List() {
    Core.call(this);

    this.values('elements', {});
  }


  List.prototype = _.create(Core.prototype, {
    'constructor': List,

    _defaults: _.defaults({
      elements: null,
      id: 'list'
    }, Core.prototype._defaults),


    addElement: function (element) {
      if (utils.checkBlocksCore(element)) {
        if (!this.hasElement(element) && element.id() !== this.id()) {
          this.values('elements')[element.id()] = element;
          return element;
        }

        console.warn('List already has element.');
        return null;
      }

      console.error('TypeError: Element to add must be a core.Core.');
      return null;
    },

    clear: function () {
      this.values(elements, {});
    },

    destroy: function () {
      this.values('elements', null);
      return Core.prototype.destroy.call(this);
    },

    getElements: function (key) {
      if (utils.checkString(key)) {
        return this.values('elements')[key];
      }

      return this.values('elements');
    },

    hasElement: function (element) {
      if (utils.checkBlocksCore(element)) {
        return _.has(this.values('elements'), element.id());
      }

      return _.has(this.values('elements'), element);
    },

    numElements: function () {
      return _.size(this.values('elements'));
    },

    removeElement: function (element) {
      if (utils.checkBlocksCore(element)) {
        if (this.hasElement(element)) {
          delete this.values('elements')[element.id()];
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
