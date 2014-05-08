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
        lodash: '../packages/lodash/dist/lodash',
        TweenLite: '../packages/greensock/src/uncompressed/TweenLite',
        EasePack: '../packages/greensock/src/uncompressed/easing/EasePack',
        ColorPropsPlugin: '../packages/greensock/src/uncompressed/plugins/ColorPropsPlugin'
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


  grunt.registerTask('packages', function () {
    // if 'dl' is not specified and the packages folder is missing
    // add the arg and continue
    if (this.args.length === 0) {
      if(!grunt.file.exists('packages/')) {
        this.args[0] = 'dl';
      }
    }

    var cmd = [];
    // Add dl as first arg to enable packages:download task
    // Disabled by default to reduce calls to API.
    if (this.args[0] === 'dl') {
      cmd.push('packages:download');
    }

    grunt.task.run(cmd);
  });

  grunt.registerTask('packages:download', function () {
    var add = 'volo:add:-nostamp:';

    // Construct a volo add command for the given lib and save repo in pkg/lib:
    function writeVolo (lib) {
      return add + grunt.config.get('pkgJson.volo.add.' + lib) + ':' +
        'packages/' + lib + '/';
    }

    var cmd = [];
    for(var pkg in grunt.config.get('pkgJson.volo.add')) {
      cmd.push(writeVolo(pkg));
    }

    grunt.task.run(cmd);
  });

  grunt.registerTask('build:dev', [
    'clean',
    'packages',
    'jshint',
    'requirejs:dev'
  ]);

  grunt.registerTask('build', [
    'clean',
    'packages',
    'jshint',
    'requirejs'
  ]);

  // Default:
  grunt.registerTask('default', ['build']);
};
