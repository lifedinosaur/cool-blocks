/*!
 * Cool Blocks
 *
 * Copyright (c) 2014 Sean Brutscher, lifedinosaur
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * */
define(
[
  'anim/Anim',
  'anim/BlockAnim',
  'base/Clone',
  'base/Group',
  'base/Path',
  'base/Pool',
  'base/Stage',
  'core/Block',
  'core/Core',
  'core/List',
  'core/Node',
  'utils',
  'lodash',
  'TweenLite',
  'EasePack',
  'ColorPropsPlugin'
],
function () {
  'use strict';

  var blocks = {
    anim: {
      Anim: require('anim/Anim'),
      BlockAnim: require('anim/BlockAnim')
    },

    base: {
      Clone: require('base/Clone'),
      Group: require('base/Group'),
      Path: require('base/Path'),
      Pool: require('base/Pool'),
      Stage: require('base/Stage')
    },

    core: {
      Block: require('core/Block'),
      Core: require('core/Core'),
      List: require('core/List'),
      Node: require('core/Node')
    },

    lib: {
      lodash: require('lodash'),
      TweenLite: require('TweenLite'),
      EasePack: require('EasePack'),
      ColorPropsPlugin: require('ColorPropsPlugin')
    },

    utils: require('utils')
  };

  return blocks;
});
