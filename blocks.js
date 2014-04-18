define(
[
  'blocks/anim/Anim',
  'blocks/anim/BlockAnim',
  'blocks/base/Clone',
  'blocks/base/Group',
  'blocks/base/Path',
  'blocks/base/Pool',
  'blocks/base/Stage',
  'blocks/core/Block',
  'blocks/core/Core',
  'blocks/core/List',
  'blocks/core/Node',
  'blocks/utils'
],
function () {
  'use strict';

  var blocks = {
    anim: {
      Anim: require('blocks/anim/Anim'),
      BlockAnim: require('blocks/anim/BlockAnim')
    },

    base: {
      Clone: require('blocks/base/Clone'),
      Group: require('blocks/base/Group'),
      Path: require('blocks/base/Path'),
      Pool: require('blocks/base/Pool'),
      Stage: require('blocks/base/Stage')
    },

    core: {
      Block: require('blocks/core/Block'),
      Core: require('blocks/core/Core'),
      List: require('blocks/core/List'),
      Node: require('blocks/core/Node')
    },

    utils: require('blocks/utils')
  };

  return blocks;
});
