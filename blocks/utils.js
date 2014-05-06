define(
[
  'lodash'
],
function (_) {
  'use strict';

  var utils = {
    ANCHOR_MODE: {
      AUTO: 'auto',
      MANUAL: 'manual'
    },

    SVG_NS: 'http://www.w3.org/2000/svg',

    SVGLINK_NS: 'http://www.w3.org/1999/xlink',

    TWO_PI: 2 * Math.PI,

    TYPES: {
      CORE: ['Block', 'Clone', 'Core', 'Group', 'List', 'Node', 'Path'],
      BLOCK: ['Block', 'Clone', 'Group', 'Path', 'Stage'],
      NODE: 'Node',
      STAGE: 'Stage',
      SVG_NODES: ['defs', 'g', 'path', 'rect', 'svg', 'use']
    },


    checkBlock: function (value) {
      if (utils.checkValid(value)) {
        if (_.isFunction(value.getConstructorName)) {
          return (_.indexOf(utils.TYPES.BLOCK, value.getConstructorName()) !== -1);
        }
      }
    },

    checkBlocksCore: function (value) {
      if (utils.checkValid(value)) {
        if (_.isFunction(value.getConstructorName)) {
          return (_.indexOf(utils.TYPES.CORE, value.getConstructorName()) !== -1);
        }
      }
    },

    checkBlocksNode: function (value) {
      if (utils.checkValid(value)) {
        if (_.isFunction(value.getConstructorName)) {
          return (utils.TYPES.NODE === value.getConstructorName());
        }
      }
    },

    checkBlocksStage: function (value) {
      if (utils.checkValid(value)) {
        if (_.isFunction(value.getConstructorName)) {
          return (utils.TYPES.STAGE === value.getConstructorName());
        }
      }
    },

    checkBoolean: function (value) {
      return (!_.isUndefined(value) && _.isBoolean(value));
    },

    checkHTML: function (value) {
      return (!_.isUndefined(value) && _.isElement(value));
    },

    checkNumber: function (value) {
      return (!_.isNaN(value) && !_.isNull(value) && _.isNumber(value));
    },

    checkString: function (value) {
      return (!_.isUndefined(value)  && !_.isNull(value) && _.isString(value));
    },

    checkSVG: function (value) {
      if (_.isString(value)) {
        return (_.indexOf(utils.TYPES.SVG_NODES, value) !== -1);
      }

      return false;
    },

    checkValid: function (value) {
      return (!_.isUndefined(value) && !_.isNaN(value) && !_.isNull(value));
    },

    createSvgNode: function (type) {
      var node = document.createElementNS(utils.SVG_NS, type);
      return node;
    },

    createSvgLink: function (url) {
      var link = document.createElementNS(utils.SVG_NS, 'a');
      link.setAttributeNS(utils.SVGLINK_NS, 'xlink:href', url);
      return link;
    },

    createSvgUseNode: function (id) {
      var node = document.createElementNS(utils.SVG_NS, 'use');
      node.setAttributeNS(utils.SVGLINK_NS, 'xlink:href', ('#' + id));

      return node;
    },

    getBoundsFromCoords: function (coords) {
      var x1 = Math.pow(10, 9);
      var x2 = 0;
      var y1 = Math.pow(10, 9);
      var y2 = 0;

      _.forEach(coords, function (coord) {
        if (coord[0] < x1) {
          x1 = coord[0];
        }
        if (coord[0] > x2) {
          x2 = coord[0];
        }
        if (coord[1] < y1) {
          y1 = coord[1];
        }
        if (coord[1] > y2) {
          y2 = coord[1];
        }
      });

      return [x2 - x1, y2 - y1];
    },

    getGear: function (edges, outerRadius, innerRadius, apex) {
      return utils.getInstructionsFrom1DCoords(
        utils.getGearCoords(edges, outerRadius, innerRadius, apex)
      );
    },

    getGearCoords: function (edges, outerRadius, innerRadius, apex) {
      var shape = [];
      var angle = utils.TWO_PI / edges;
      var fifthAngle = angle / 5;
      apex = (utils.checkNumber(apex)) ? apex : 0;
      apex *= fifthAngle;

      for (var i = 0; i < utils.TWO_PI; i += angle) {
        shape.push([
          innerRadius * Math.cos(i + OFFSET),
          innerRadius * Math.sin(i + OFFSET)
        ], [
          outerRadius * Math.cos(fifthAngle + apex + i + OFFSET),
          outerRadius * Math.sin(fifthAngle + apex + i + OFFSET)
        ], [
          outerRadius * Math.cos((fifthAngle * 2) + i + OFFSET),
          outerRadius * Math.sin((fifthAngle * 2) + i + OFFSET)
        ], [
          outerRadius * Math.cos((fifthAngle * 3) - apex + i + OFFSET),
          outerRadius * Math.sin((fifthAngle * 3) - apex + i + OFFSET)
        ], [
          innerRadius * Math.cos((fifthAngle * 4) + i + OFFSET),
          innerRadius * Math.sin((fifthAngle * 4) + i + OFFSET)
        ]);
      }

      var bounds = utils.getBoundsFromCoords(shape);
      bounds[0] /= 2;
      bounds[1] /= 2;

      utils.offsetCoords(shape, bounds);

      return shape;
    },

    getInstructionsFrom1DCoords: function (coords) {
      var instructions = [];
      _.forEach(coords, function (coord, i) {
        var cmd = 'L';
        if (i === 0) {
          cmd = 'M';
        }
        instructions.push({
          cmd: cmd,
          v: [coord[0], coord[1]]
        });
      });
      instructions.push({
        cmd: 'z'
      });

      return instructions;
    },

    getInstructionsFrom2DCoords: function (coords) {
      var instructions = [];
      _.forEach(coords, function (set) {
        _.forEach(set, function (coord, ii) {
          var cmd = 'L';
          if (ii === 0) {
            cmd = 'M';
          }
          instructions.push({
            cmd: cmd,
            v: [coord[0], coord[1]]
          });
        });
        instructions.push({
          cmd: 'z'
        });
      });
      instructions.push({
        cmd: 'z'
      });

      return instructions;
    },

    getPolygon: function (edges, radius) {
      return utils.getInstructionsFrom1DCoords(
        utils.getPolygonCoords(edges, radius)
      );
    },

    getPolygonCoords: function (edges, radius) {
      var shape = [];
      var angle = utils.TWO_PI / edges;

      for (var i = 0; i < utils.TWO_PI; i += angle) {
        shape.push([
          radius * Math.cos(i + OFFSET),
          radius * Math.sin(i + OFFSET)
        ]);
      }

      var bounds = utils.getBoundsFromCoords(shape);
      bounds[0] /= 2;
      bounds[1] /= 2;

      utils.offsetCoords(shape, bounds);

      return shape;
    },

    getRandomColor: function (cMin, cMax, aMin, aMax, rMin, rMax, gMin, gMax, bMin, bMax) {
      cMin = cMin || 0;
      cMax = cMax || 255;

      rMin = rMin || cMin;
      rMax = rMax || cMax;
      gMin = gMin || cMin;
      gMax = gMax || cMax;
      bMin = bMin || cMin;
      bMax = bMax || cMax;

      var r = utils.getRandomInteger(rMin, rMax);
      var g = utils.getRandomInteger(gMin, gMax);
      var b = utils.getRandomInteger(bMin, bMax);

      if (!_.isUndefined(aMin) && !_.isUndefined(aMax)) {
        var a = utils.getRandomNumber(aMin, aMax);

        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
      }

      return 'rgb(' + r + ',' + g + ',' + b + ')';
    },

    getRing: function (edges, outerRadius, innerRadius) {
      return utils.getInstructionsFrom2DCoords(
        utils.getRingCoords(edges, outerRadius, innerRadius)
      );
    },

    getRingCoords: function (edges, outerRadius, innerRadius) {
      var shape = [];
      var angle = utils.TWO_PI / edges;

      var outerRing = [];
      var innerRing = [];
      for (var i = 0; i < utils.TWO_PI; i += angle) {
        outerRing.push([
          outerRadius * Math.cos(i + OFFSET),
          outerRadius * Math.sin(i + OFFSET)
        ]);
        innerRing.push([
          innerRadius * Math.cos(utils.TWO_PI - i + OFFSET),
          innerRadius * Math.sin(utils.TWO_PI - i + OFFSET)
        ]);
      }

      var oBounds = utils.getBoundsFromCoords(outerRing);
      var iBounds = utils.getBoundsFromCoords(innerRing);

      var bounds = [Math.max(oBounds[0], iBounds[0]),
        Math.max(oBounds[1], iBounds[1])];

      bounds[0] /= 2;
      bounds[1] /= 2;

      utils.offsetCoords(outerRing, bounds);
      utils.offsetCoords(innerRing, bounds);

      shape.push(outerRing, innerRing);

      return shape;
    },

    getRandomInteger: function (min, max) {
      if (utils.checkNumber(min) && utils.checkNumber(max)) {
        return Math.round(min + (Math.random() * (max - min)));
      }

      return 0;
    },

    getRandomNumber: function (min, max) {
      if (utils.checkNumber(min) && utils.checkNumber(max)) {
        return min + (Math.random() * (max - min));
      }

      return Math.random();
    },

    getStar: function (edges, outerRadius, innerRadius) {
      return utils.getInstructionsFrom1DCoords(
        utils.getStarCoords(edges, outerRadius, innerRadius)
      );
    },

    getStarCoords: function (edges, outerRadius, innerRadius) {
      var shape = [];
      var angle = utils.TWO_PI / edges;
      var halfAngle = angle / 2;

      for (var i = 0; i < utils.TWO_PI; i += angle) {
        shape.push([
          outerRadius * Math.cos(i + OFFSET),
          outerRadius * Math.sin(i + OFFSET)
        ], [
          innerRadius * Math.cos(halfAngle + i + OFFSET),
          innerRadius * Math.sin(halfAngle + i + OFFSET)
        ]);
      }

      var bounds = utils.getBoundsFromCoords(shape);
      bounds[0] /= 2;
      bounds[1] /= 2;

      utils.offsetCoords(shape, bounds);

      return shape;
    },

    getSun: function (edges, outerRadius, innerRadius) {
      return utils.getInstructionsFrom1DCoords(
        utils.getSunCoords(edges, outerRadius, innerRadius)
      );
    },

    getSunCoords: function (edges, outerRadius, innerRadius) {
      var shape = [];
      var angle = utils.TWO_PI / edges;
      var halfAngle = angle / 2;

      for (var i = 0; i < utils.TWO_PI; i += angle) {
        shape.push([
          outerRadius * Math.cos(i + OFFSET),
          outerRadius * Math.sin(i + OFFSET)
        ], [
          innerRadius * Math.cos(i + OFFSET),
          innerRadius * Math.sin(i + OFFSET)
        ]);
      }

      var bounds = utils.getBoundsFromCoords(shape);
      bounds[0] /= 2;
      bounds[1] /= 2;

      utils.offsetCoords(shape, bounds);

      return shape;
    },

    offsetCoords: function (shape, offset) {
      _.map(shape, function (coord) {
        coord[0] += offset[0];
        coord[1] += offset[1];
        return coord;
      });
    },

    roundTo: function (toRound, decPlaces) {
      return (Math.round(toRound * Math.pow(10, decPlaces)) / Math.pow(10, decPlaces));
    },

    toDegrees: function (radians) {
      return radians * 180 / Math.PI;
    },

    toRadians: function (degrees) {
      return degrees * Math.PI / 180;
    },

    writeSvgDefsUrl: function (id) {
      return 'url(#' + id + ')';
    },

    writeSvgPath: function (instructions) {
      var path = '';
      _.forEach(instructions, function (instruction) {
        path += instruction.cmd;
        _.forEach(instruction.v, function (val) {
          path += utils.roundTo(val, ROUND_PRECISION) + ' ';
        });
      });

      return path;
    },

    writeSvgTransform: function (rules) {
      var transform = '';
      _.each(rules, function (value, key) {
        transform += key + '(';
        _.each(value, function (v, i) {
          transform += v;
          if (i < value.length - 1) {
            transform += ',';
          }
        });
        transform += ')';
      });

      return transform;
    }
  };

  // Calculation constants:
  var OFFSET = -utils.toRadians(90);
  var ROUND_PRECISION = 6; // decimal places


  return utils;
});
