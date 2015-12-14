module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    },
    concat: {
      options: {
        separator: "\n\n"
      },
      dist: {
        src: [
          'src/_intro.js',
          'src/main.js',
          'src/_outro.js'
        ],
        dest: 'dist/<%= pkg.name.replace(".js", "") %>.js'
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'version',
              replacement: '<%= pkg.version %>'
            }
          ]
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ['dist/luffa.js', 'dist/luffa.min.js'],
            dest: 'dist/'
          }
        ]
      }
    },
    watch: {
      files: ['src/*.js'],
      tasks: ['concat', 'replace']
    },
    coverage: {
      default: {
        options: {
          thresholds: {
            'statements': 75
          },
          dir: 'coverage/json/',
          root: 'reports'
        }
      }
    }
  });

  grunt.task.registerTask('vendor', 'A sample task that logs stuff.', function() {
    //browserify
    var shell = require('shelljs');
    shell.mkdir('vendor');
    shell.exec('browserify -r html2hscript -o vendor/html2hscript.js');

  });
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['vendor', 'concat', 'replace', 'karma', 'coverage']);
};
