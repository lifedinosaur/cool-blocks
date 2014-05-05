define(
[
  'lodash',
  'utils',
  'core/Block'
],
function (_, utils, Block) {
  'use strict';

  function Path(domClass, domId) {
    Block.call(this, domClass, domId);
  }

  Path.prototype = _.create(Block.prototype, {
    'constructor': Path,

    _defaults: _.defaults({
      constructorName: 'Path',
      d: undefined,
      domClass: 'path',
      domId: 'path',
      id: 'path',
      nodeType: 'path',

    }, Block.prototype._defaults),

    _bindAttributes: _.union(['d'], Block.prototype._bindAttributes),

    _dirtyAttributes: _.union(['d'], Block.prototype._dirtyAttributes),


    drawPathFromCoords: function (coords) {
      this.values('d', utils.writeSvgPath(coords));
      return this;
    }
  });

  return Path;
});
