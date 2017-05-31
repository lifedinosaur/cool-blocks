module.exports = function(grunt) {
  "use strict";

  // load tasks:
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkgJson: grunt.file.readJSON('package.json'),

    clean: {
      blocks: [
        'blocks.js',
        'blocks.min.js'
      ]
    },

    jshint: {
      blocks: [
        'Gruntfile.js',
        'blocks/' + '**/*.js'
      ]
    },

    requirejs: {
      dev: createRequireOptions('dev'),
      prod: createRequireOptions('prod')
    }
  });

  function createRequireOptions(type) {
    var opts = {
      baseUrl: 'blocks/',
      name: 'blocks',
      out: 'blocks.min.js',
      paths: {
        lodash: '../bower_components/lodash/dist/lodash',
        TweenLite: '../bower_components/gsap/src/uncompressed/TweenLite',
        EasePack: '../bower_components/gsap/src/uncompressed/easing/EasePack',
        ColorPropsPlugin: '../bower_components/gsap/src/uncompressed/plugins/ColorPropsPlugin'
      },
      findNestedDependencies: true,
      insertRequire: ['blocks']
    };

    if (type === 'dev') {
      opts.out = 'blocks.js';
      opts.optimize = 'none';
    }

    return {
      options: opts
    };
  }


  grunt.registerTask('build:dev', [
    'clean',
    'jshint',
    'requirejs:dev'
  ]);

  grunt.registerTask('build', [
    'clean',
    'jshint',
    'requirejs'
  ]);

  // Default:
  grunt.registerTask('default', ['build']);
};
