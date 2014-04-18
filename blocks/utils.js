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

    getGearCoordinates: function (edges, outerRadius, innerRadius, apex) {
      var shape = [];
      var angle = utils.TWO_PI / edges;
      var fifthAngle = angle / 5;
      apex = (utils.checkNumber(apex)) ? apex : 0;
      apex *= fifthAngle;

      for (var i = 0; i < utils.TWO_PI; i+=angle) {
        shape.push([
          innerRadius * Math.cos(i + OFFSET) + outerRadius,
          innerRadius * Math.sin(i + OFFSET) + outerRadius
        ], [
          outerRadius * Math.cos(fifthAngle + apex + i + OFFSET) + outerRadius,
          outerRadius * Math.sin(fifthAngle + apex + i + OFFSET) + outerRadius
        ], [
          outerRadius * Math.cos((fifthAngle * 2) + i + OFFSET) + outerRadius,
          outerRadius * Math.sin((fifthAngle * 2) + i + OFFSET) + outerRadius
        ], [
          outerRadius * Math.cos((fifthAngle * 3) - apex + i + OFFSET) + outerRadius,
          outerRadius * Math.sin((fifthAngle * 3) - apex + i + OFFSET) + outerRadius
        ], [
          innerRadius * Math.cos((fifthAngle * 4) + i + OFFSET) + outerRadius,
          innerRadius * Math.sin((fifthAngle * 4) + i + OFFSET) + outerRadius
        ]);
      }

      return shape;
    },

    getPolygonCoordinates: function (edges, radius) {
      var shape = [];
      var angle = utils.TWO_PI / edges;

      for (var i = 0; i < utils.TWO_PI; i+=angle) {
        shape.push([
          radius * Math.cos(i + OFFSET) + radius,
          radius * Math.sin(i + OFFSET) + radius
        ]);
      }

      return shape;
    },

    getRandomColor: function (cMin, cMax, aMin, aMax, rMin, rMax, gMin, gMax, bMin, bMax) {
      cMin = (_.isUndefined(cMin)) ? 0 : cMin;
      cMax = (_.isUndefined(cMax)) ? 255 : cMax;

      rMin = (_.isUndefined(rMin)) ? cMin : rMin;
      rMax = (_.isUndefined(rMax)) ? cMax : rMax;
      gMin = (_.isUndefined(gMin)) ? cMin : gMin;
      gMax = (_.isUndefined(gMax)) ? cMax : gMax;
      bMin = (_.isUndefined(bMin)) ? cMin : bMin;
      bMax = (_.isUndefined(bMax)) ? cMax : bMax;

      var r = utils.getRandomInteger(rMin, rMax);
      var g = utils.getRandomInteger(gMin, gMax);
      var b = utils.getRandomInteger(bMin, bMax);

      if (!_.isUndefined(aMin) && !_.isUndefined(aMax)) {
        var a = utils.getRandomNumber(aMin, aMax);

        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
      }

      return 'rgb(' + r + ',' + g + ',' + b + ')';
    },

    getRingCoordinates: function (edges, outerRadius, innerRadius) {
      var shape = [];
      var angle = utils.TWO_PI / edges;

      var outerRing = [];
      var innerRing = [];
      for (var i = 0; i < utils.TWO_PI; i+=angle) {
        outerRing.push([
          outerRadius * Math.cos(i + OFFSET) + outerRadius,
          outerRadius * Math.sin(i + OFFSET) + outerRadius
        ]);
        innerRing.push([
          innerRadius * Math.cos(utils.TWO_PI - i + OFFSET) + outerRadius,
          innerRadius * Math.sin(utils.TWO_PI - i + OFFSET) + outerRadius
        ]);
      }
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

    getStarCoordinates: function (edges, outerRadius, innerRadius) {
      var shape = [];
      var angle = utils.TWO_PI / edges;
      var halfAngle = angle / 2;

      for (var i = 0; i < utils.TWO_PI; i+=angle) {
        shape.push([
          outerRadius * Math.cos(i + OFFSET) + outerRadius,
          outerRadius * Math.sin(i + OFFSET) + outerRadius
        ], [
          innerRadius * Math.cos(halfAngle + i + OFFSET) + outerRadius,
          innerRadius * Math.sin(halfAngle + i + OFFSET) + outerRadius
        ]);
      }

      return shape;
    },

    getSunCoordinates: function (edges, outerRadius, innerRadius) {
      var shape = [];
      var angle = utils.TWO_PI / edges;
      var halfAngle = angle / 2;

      for (var i = 0; i < utils.TWO_PI; i+=angle) {
        shape.push([
          outerRadius * Math.cos(i + OFFSET) + outerRadius,
          outerRadius * Math.sin(i + OFFSET) + outerRadius
        ], [
          innerRadius * Math.cos(i + OFFSET) + outerRadius,
          innerRadius * Math.sin(i + OFFSET) + outerRadius
        ]);
      }

      return shape;
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

    writeSvgPath: function (shape) {
      if (!shape || !shape.length) {
        return;
      }

      var dimensions = 0;
      var check = shape[0];
      while (_.isArray(check)) {
        check = check[0];
        dimensions++;
      }

      var path = 'M0,0z';
      switch (dimensions) {
        case 1:
        path = utils.writeSvgPathSegment(shape);
        break;
        case 2:
        path = utils.writeSvgPathSegment(shape[0]);
        for (var i = 1; i < shape.length; i++) {
          path += ' ' + utils.writeSvgPathSegment(shape[i]);
        }
        break;
        default:
        console.error('Error: 3+ dimensional paths not yet supported');
        break;
      }

      return path;
    },

    writeSvgPathSegment: function (segment) {
      var path = 'M' + segment[0][0] + ',' + segment[0][1];
      for (var i = 1, ii = segment.length; i < ii; i++) {
        path += ' L' + segment[i][0] + ',' + segment[i][1];
      }
      path += 'z';

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

  var OFFSET = -utils.toRadians(90);

  return utils;
});
