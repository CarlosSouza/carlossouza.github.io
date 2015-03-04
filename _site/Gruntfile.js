/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '1.0.0'
    },
    // Task configuration.
    uglify: {
      dist: {
        files: grunt.file.expandMapping(['js/*.js', '!js/*.min.js'], '', {
          rename: function(destBase, destPath) {
            return destBase+destPath.replace('.js', '.min.js');
          }
        }),
        options: {
          sourceMap: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
      },
      bower: {
        options: {
          mangle: true,
          compress: true
        },
        files: {
          'js/_bower.min.js': 'js/_bower.js'
        }
      },
    },
    jekyll: {
      dest: '_site',
      config: '_config.yml'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        ignores: ['js/_bower.js', 'js/_bower.min.js', 'js/plugins.js', 'js/plugins.min.js'],
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'scss',
          src: ['*.scss'],
          dest: 'css',
          ext: '.css',
        }],
        options: {
          style: 'compressed'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9']
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: 'css/*.css',
        dest: 'css/'
      },
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'imagens/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'imagens/'
        }]
      }
    },
    bower_concat: {
      all: {
        dest: 'js/_bower.js',
        cssDest: 'css/_bower.css',
        exclude: [
          'jquery',
          'modernizr'
        ],
        bowerOptions: {
          relative: false
        }
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            "css/*.css",
            "*.html",
            "js/*.js"
          ]
        },
        options: {
          ghostMode: {
            clicks: true,
            location: true,
            forms: true,
            scroll: true
          },
          watchTask: true,
          proxy: "localhost:8888"
        }
      }
    },
    watch: {
      files: ['*.html', 'imagens/*.png', 'imagens/*.jpg', 'js/*.js', '../**/*.php'],
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      css: {
        files: 'scss/*.scss',
        tasks: ['sass', 'autoprefixer']
      },
      jekyll: {
        files: ['*.html', '*.md', '_layouts/*', '_includes/*', 'css/*'],
        tasks: ['jekyll']
      },
      scripts: {
        files: ['js/*'],
        tasks: ['uglify', 'uglify:bower', 'jshint'],
        options: {
          spawn: false,
        },
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-jekyll');

  // Default task.
  grunt.registerTask('default', ['bower_concat','imagemin','watch','browserSync']);

};