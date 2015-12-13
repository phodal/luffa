module.exports = function (grunt) {
  grunt.initConfig({
    karma: {
      options: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      auto: {}
    },
    browserify: {
      client: {
        files: {
          'vendor/html2hscript.js': ['node_modules/html2hscript/index.js']
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  //browserify
  var shell = require('shelljs');
  shell.exec('browserify -r html2hscript -o vendor/html2hscript.js');
  shell.exec('browserify -r is-object -o vendor/is-object.js');

  grunt.registerTask('default', ['karma']);
};
