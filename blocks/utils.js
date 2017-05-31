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
      SVG_NODES: ['defs', 'g', 'path', 'pattern', 'rect', 'svg', 'use']
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

    combineInstructions: function() {
      var target = [];
      var sources = target.concat.apply([], arguments);
      _.forEach(sources, function (source) {
        target.push(source);
      });

      return target;
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

    getBezierLine: function (cX1, cY1, cX2, cY2, x2, y2, x1, y1, start, close) {
      if (_.isUndefined(x1) && _.isUndefined(y1)) {
        start = false;
      }
      else {
        start = utils.checkBoolean(start) ? start : true;
      }
      close = utils.checkBoolean(close) ? close : false;

      var instructions = [];
      if (start) {
        instructions.push({
          cmd: 'M',
          v: [x1, y1]
        });
      }
      // C x1 y1, x2 y2, x y
      instructions.push({
        cmd: 'C',
        v: [cX1, cY1, ',', cX2, cY2, ',', x2, y2]
      });
      if (close) {
        instructions.push({
          cmd: 'Z'
        });
      }

      return instructions;
    },

    getArcLine: function (x2, y2, x1, y1, arcDir, start, close) {
      arcDir = utils.checkNumber(arcDir) ? arcDir : 1;
      start = utils.checkBoolean(start) ? start : true;
      close = utils.checkBoolean(close) ? close : false;

      var distRadius = (Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))) / 2;

      var instructions = [];
      if (start) {
        instructions.push({
          cmd: 'M',
          v: [x1, y1]
        });
      }
      instructions.push({
        cmd: 'A',
        v: [distRadius, distRadius, 0, 1, arcDir, x2, y2]
      });
      if (close) {
        instructions.push({
          cmd: 'Z'
        });
      }

      return instructions;
    },

    getArcSolid: function (startAngle, endAngle, outerRadius, innerRadius) {
      // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

      innerRadius = innerRadius || 0;

      var radiusDelta = outerRadius - innerRadius;
      var angleDelta = endAngle - startAngle;

      var instructions = [];
      if (Math.abs(angleDelta) === 360 || Math.abs(angleDelta) > 360) {
        instructions.push({
          cmd: 'M',
          v: [outerRadius, 0]
        }, {
          cmd: 'A',
          v: [outerRadius, outerRadius, 0, 1, 1, outerRadius, outerRadius * 2]
        }, {
          cmd: 'A',
          v: [outerRadius, outerRadius, 0, 1, 1, outerRadius, 0]
        });

        if (innerRadius > 0) {
          instructions.push({
            cmd: 'M',
            v: [outerRadius, radiusDelta]
          }, {
            cmd: 'A',
            v: [innerRadius, innerRadius, 0, 1, 0, outerRadius, innerRadius * 2 + radiusDelta]
          }, {
            cmd: 'A',
            v: [innerRadius, innerRadius, 0, 1, 0, outerRadius, radiusDelta]
          }, {
            cmd: 'Z'
          });
        }

        instructions.push({
          cmd: 'Z'
        });
      }
      else {
        var sAng = utils.toRadians(startAngle - 90);
        var eAng = utils.toRadians(endAngle - 90);

        var aX1 = Math.cos(sAng);
        var aX2 = Math.cos(eAng);
        var aY1 = Math.sin(sAng);
        var aY2 = Math.sin(eAng);

        var dir = (angleDelta < 180) && (angleDelta > -180) ? 0 : 1;
        var sweep = (angleDelta > 0);

        var modInnerRadius = radiusDelta + innerRadius;
        instructions.push({
          cmd: 'M',
          v: [modInnerRadius + innerRadius * aX1, modInnerRadius + innerRadius * aY1]
        }, {
          cmd: 'A',
          v: [innerRadius, innerRadius, 0, dir, +(sweep), modInnerRadius + innerRadius * aX2, modInnerRadius + innerRadius * aY2]
        }, {
          cmd: 'L',
          v: [outerRadius + outerRadius * aX2, outerRadius + outerRadius * aY2]
        }, {
          cmd: 'A',
          v: [outerRadius, outerRadius, 0, dir, +(!sweep), outerRadius + outerRadius * aX1, outerRadius + outerRadius * aY1]
        }, {
          cmd: 'Z'
        });
      }

      return instructions;
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
      apex = apex || 0;
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

    getInstructionsFrom1DCoords: function (coords, start, close) {
      start = utils.checkBoolean(start) ? start : true;
      close = utils.checkBoolean(close) ? close : true;

      var instructions = [];
      _.forEach(coords, function (coord, i) {
        var cmd = 'L';
        if (i === 0 && start) {
          cmd = 'M';
        }
        instructions.push({
          cmd: cmd,
          v: [coord[0], coord[1]]
        });
      });
      if (close) {
        instructions.push({
          cmd: 'Z'
        });
      }

      return instructions;
    },

    getInstructionsFrom2DCoords: function (coords) {
      var instructions = [];
      _.forEach(coords, function (set) {
        _.forEach(set, function (coord, i) {
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
          cmd: 'Z'
        });
      });
      instructions.push({
        cmd: 'Z'
      });

      return instructions;
    },

    getLine: function (x2, y2, x1, y1, start, close) {
      if (_.isUndefined(x1) && _.isUndefined(y1)) {
        start = false;
      }
      else {
        start = utils.checkBoolean(start) ? start : true;
      }
      close = utils.checkBoolean(close) ? close : false;

      var instructions = [];
      if (start) {
        instructions.push({
          cmd: 'M',
          v: [x1, y1]
        });
      }
      instructions.push({
        cmd: 'L',
        v: [x2, y2]
      });
      if (close) {
        instructions.push({
          cmd: 'Z'
        });
      }

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
      _.forEach(instructions, function (instruction, i) {
        if (i !== 0) {
          path += ' ';
        }
        path += instruction.cmd;
        _.forEach(instruction.v, function (val, ii) {
          if (utils.checkNumber(val)) {
            if (ii !== 0) {
              path += ' ';
            }
            path += utils.roundTo(val, ROUND_PRECISION);
          }
          else {
            path += val;
          }
        });
      });

      return path;
    },

    writeSvgTransform: function (rules) {
      var transform = '';
      _.each(rules, function (value, key) {
        transform += key + '(';
        _.each(value, function (v, i) {
          transform += utils.roundTo(v, ROUND_PRECISION);
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
