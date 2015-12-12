module.exports = function (grunt) {
  grunt.initConfig({
    karma: {
      options: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      auto: {}
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['karma']);
};
