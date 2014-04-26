define(
[
  'lodash',
  'blocks/utils',
  'blocks/core/Core'
],
function (_, utils, Core) {
  'use strict';

  function Anim(options) {
    if (_.isUndefined(options) || !_.isObject(options)) {
      console.error('Error: Anim requires an options object.');
      return null;
    }

    Core.call(this);

    this.values('tween', this._createTween(options));
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
      return TweenLite.to(this.values(),
        this.values('duration'), tweenOptions).pause(); // init paused
    },

    _createTweenOptions: function (options) {
      var tweenValues = this.values('tweenValues');
      _.defaults(tweenValues, options); // blend into any existing values

      _.forEach(options, function (value, key) {
        if (_.isArray(value)) {
          this.values(key, value[0]);
          tweenValues[key] = value[1];
        }
        else {
          this.values(key, value);
        }
      }, this);

      var tweenOptions = {
        ease: (this.values('ease')) ? this.values('ease') : Sine.easeInOut,
        onComplete: this.values('onComplete'),
        onCompleteParams: [this],
        onReverseComplete: this.values('onReverseComplete'),
        onReverseCompleteParams: [this],
        onUpdate: this.values('onUpdate'),
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
      this.values('tween').pause();
      return;
    },

    play: function () {
      this.values('tween').play();
      return this;
    },

    restart: function () {
      this.values('tween').restart();
      return this;
    },

    reverse: function () {
      this.values('tween').reverse();
      return this;
    }
  });

  return Anim;
});
