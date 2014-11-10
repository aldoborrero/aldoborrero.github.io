(function() {

  'use strict';

  module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    var config = {
      app: 'app',
      dist: 'dist',
      tmp: '.tmp'
    };

    grunt.initConfig({

      config: config,

      connect: {
        options: {
          port: 3000,
          open: true,
          livereload: 35729,
          hostname: 'localhost'
        },
        livereload: {
          options: {
            middleware: function(connect) {
              return [
                connect.static('<%= config.tmp %>'),
                connect().use('/bower_components', connect.static('./bower_components')),
                connect.static(config.app),
                connect().use('/css', connect.static('<%= config.tmp %>/css'))
              ];
            }
          }
        },
        dist: {
          options: {
            base: '<%= config.dist %>',
            livereload: false,
            keepalive: true
          }
        }
      },

      watch: {
        bower: {
          files: ['bower.json'],
          tasks: ['wiredep', 'bower:install', 'bower:target']
        },
        gruntfile: {
          files: ['Gruntfile.js']
        },
        npm: {
          files: ['package.json'],
          tasks: ['npm-install']
        },
        js: {
          files: ['<%= config.app %>/js/{,*/}*.js'],
        },
        less: {
          files: ['<%= config.app %>/less/{,*/}*.less'],
          tasks: ['less:dev']
        },
        livereload: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          files: [
            '<%= config.app %>/{,*/}*.html',
            '<%= config.tmp %>/css/{,*/}*.css',
            '<%= config.tmp %>/js/{,*/}*.js',
            '<%= config.app %>/img/{,*/}*'
          ]
        }
      },

      clean: {
        dist: {
          files: [{
            dot: true,
            src: [
              '<%= config.tmp %>',
              '<%= config.dist %>/*',
              '!<%= config.dist %>/.git*'
            ]
          }]
        },
        server: '<%= config.tmp %>'
      },

      bower: {
        target: {
          rjsConfig: '<%= config.app %>/js/app/config/app.js'
        },
        install: {}
      },

      useminPrepare: {
        options: {
          dest: '<%= config.dist %>'
        },
        html: '<%= config.app %>/index.html'
      },

      usemin: {
        html: ['<%= config.dist %>/{,*/}*.html']
      },

      imagemin: {
        dist: {
          files: [{
            expand: true,
            cwd: '<%= config.app %>/img',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= config.dist %>/img'
          }]
        }
      },

      htmlmin: {
        dist: {
          options: {
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeOptionalTags: true,
            removeComments: true
          },
          files: [{
            expand: true,
            cwd: '<%= config.dist %>',
            src: ['*.html'],
            dest: '<%= config.dist %>'
          }]
        }
      },

      less: {
        dev: {
          options: {
            paths: [
              '<%= config.app %>/less',
              'bower_components/bootstrap/less'
            ]
          },
          files: {
            '<%= config.tmp %>/css/style.css': '<%= config.app %>/less/style.less'
          }
        },
        dist: {
          options: {
            paths: [
              '<%= config.app %>/less',
              'bower_components/bootstrap/less'
            ]
          },
          files: {
            '<%= config.app %>/css/style.css': '<%= config.app %>/less/style.less'
          }
        }
      },

      uncss: {
        dist: {
          files: {
            '<%= config.dist %>/css/style.css': ['<%= config.dist %>/index.html']
          }
        }
      },

      rev: {
        dist: {
          files: {
            src: [
              '<%= config.dist %>/js/{,*/}*.js',
              '<%= config.dist %>/css/{,*/}*.css',
              '<%= config.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            ]
          }
        }
      },

      wiredep: {
        task: {
          src: ['<%= config.app %>/{,*/}*.html']
        }
      },

      copy: {
        dist: {
          files: [{
            expand: true,
            dot: true,
            cwd: '<%= config.app %>',
            dest: '<%= config.dist %>',
            src: [
              '<%= config.app %>/*.{ico,png,txt}',
            ]
          }, {
            expand: true,
            cwd: '<%= config.app %>/img',
            dest: '<%= config.dist %>/img',
            src: ['generated/*']
          }, {
            src: '<%= config.app %>/index.html',
            dest: '<%= config.dist %>/index.html'
          }]
        }
      },

      filerev: {
        styles: {
          src: '<%= config.dist %>/{,*/}*.css'
        },
        scripts: {
          src: '<%= config.dist %>/{,*/}*.js'
        }
      }

    });

    grunt.registerTask('dev', [
      'clean:server',
      //'bower',
      'less:dev',
      'connect:livereload',
      'watch'
    ]);

    grunt.registerTask('build', [
      'clean:dist',
      'less:dist',
      'useminPrepare',
      'concat:generated',
      'cssmin:generated',
      'uglify:generated',
      'filerev',
      'copy',
      //'imagemin',
      'usemin',
      'uncss',
      'htmlmin',
    ]);

    grunt.registerTask('build:server', [
      'build',
      'connect:dist'
    ]);

  };

})();
