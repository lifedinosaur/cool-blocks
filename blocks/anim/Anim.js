define(
[
  'lodash',
  'utils',
  'core/Core'
],
function (_, utils, Core) {
  'use strict';

  function Anim(options) {
    if (_.isUndefined(options) || !_.isObject(options)) {
      console.error('Error: Anim requires an options object.');
      return null;
    }

    Core.call(this);

    this._v.tween = this._createTween(options);
  }

  Anim.prototype = _.create(Core.prototype, {
    'constructor': Anim,

    _defaults: _.defaults({
      constructorName: 'Anim',
      duration: 1,
      id: 'anim',
      tween: null,
      tweenValues: {}
    }, Core.prototype._defaults),


    _createTween: function (options) {
      var tweenOptions = this._createTweenOptions(options); // sets duration
      return TweenLite.to(this._v, this._v.duration, tweenOptions).pause(); // init paused
    },

    _createTweenOptions: function (options) {
      var tweenValues = this._v.tweenValues;
      _.defaults(tweenValues, options); // blend into any existing values

      _.forEach(options, function (value, key) {
        if (_.isArray(value)) {
          this._v[key] = value[0];
          tweenValues[key] = value[1];
        }
        else {
          this._v[key] = value;
        }
      }, this);

      var tweenOptions = {
        ease: (this._v.ease) ? this._v.ease : Sine.easeInOut,
        onComplete: this._v.onComplete,
        onCompleteParams: [this],
        onReverseComplete: this._v.onReverseComplete,
        onReverseCompleteParams: [this],
        onUpdate: this._v.onUpdate,
        onUpdateParams: [this]
      };

      // format color for plugin:
      if (utils.checkString(tweenValues.fill)) {
        tweenOptions.colorProps = {
          fill: tweenValues.fill
        };

        delete tweenValues.fill;
      }
      if (utils.checkString(tweenValues.stroke)) {
        tweenOptions.colorProps = {
          stroke: tweenValues.stroke
        };

        delete tweenValues.stroke;
      }

      return _.defaults(tweenOptions, tweenValues);
    },

    destroy: function () {
      this._v.tweenValues = null;
      this._v.tween = null;
      return Core.prototype.destroy.call(this);
    },

    pause: function () {
      this._v.tween.pause();
      return;
    },

    play: function () {
      this._v.tween.play();
      return this;
    },

    restart: function () {
      this._v.tween.restart();
      return this;
    },

    reverse: function () {
      this._v.tween.reverse();
      return this;
    }
  });

  return Anim;
});
