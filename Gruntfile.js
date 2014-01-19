// Generated on 2014-01-05 using generator-angular 0.6.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-google-cdn');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-rev');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-karma');

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },
    shell: {
      deploy: {
        command: 'scp -r dist/* do:/var/www/angular/'
      },
      copy_to_staging: {
        command: 'rsync -av --delete dist/* staging/',
        options: {
          stdout: true
        }
      },
      copy_to_integration: {
        command: 'rsync -av --delete dist/* integration/',
        options: {
          stdout: true
        }
      },
      capybara: {
        command: 'pushd ~/git/sidelined-rails3; rspec -P spec/features/*_spec.rb; popd',
        options: {
          stdout: true
        }
      }
    },

    jade: {
      dist: { 
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '.tmp',
          src: '**/*.jade',
          ext: '.html'
        }],
        options: {
          pretty: true,
          data: {
            dev: false,
            integration: false
          }
        }
      },
      integration: { 
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '.tmp',
          src: '**/*.jade',
          ext: '.html'
        }],
        options: {
          pretty: true,
          data: {
            dev: false,
            integration: true
          }
        }
      },
      dev: { 
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '.tmp',
          src: '**/*.jade',
          ext: '.html'
        }],
        options: {
          pretty: true,
          data: {
            dev: true,
            integration: false
          }
        }
      }
    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      jade: {
        files: ['<%= yeoman.app %>/**/*.jade'],
        tasks: ['jade:dev']
      },
      js: {
        files: ['{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all']
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: {
            port: 35729,
            key: grunt.file.read('./node_modules/grunt-contrib-connect/tasks/certs/server.key'),
            cert: grunt.file.read('./node_modules/grunt-contrib-connect/tasks/certs/server.crt')
          }
        },
        files: [
          '.tmp/{,*}*.html',
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      karma: {
        files: ['app/scripts/**/*.js', 'test/spec/**/*.js'],
        tasks: ['karma:unit:run'] //NOTE the :run flag
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        protocol: 'https'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ],
          middleware: function(connect, options) {
            return [
              require('grunt-connect-proxy/lib/utils').proxyRequest,
              //require('connect-modrewrite')(['!(\\..+)$ / [L]']),
              require('connect-modrewrite')([
                '^/injuries(/.*)? / [L]',
                '^/signup / [L]',
                '^/help / [L]',
                '^/confirmed(.*)? / [L]'
              ]),
              connect.static('.tmp'),
              connect.static(grunt.config.data.yeoman.app),
              connect.directory('<%= yeoman.app %>')
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      },
      proxies: [
        {
          context: '/api',
          host: 'sidelined.local',
          port: 443,
          https: true,
          changeOrigin: false,
          xforward: false
        }
      ],
      coverage: {
        options: {
          base: 'coverage/',
          port: 5555,
          keepalive: true
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated',
          environment: 'production'
        }
      },
      server: {
        options: {
          environment: 'development',
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '.tmp/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    htmlmin: {
      dist: {
        options: {
          // Optional configurations that you can uncomment to use
          // removeCommentsFromCDATA: true,
          // collapseBooleanAttributes: true,
          // removeAttributeQuotes: true,
          // removeRedundantAttributes: true,
          // useShortDoctype: true,
          // removeEmptyAttributes: true,
          // removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '.tmp',
          src: ['**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.{webp}',
            'fonts/*',
            'bower_components/sass-bootstrap/fonts/*',
            '*.html'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: [
            'generated/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'jade:dev',
        'compass:server',
        'copy:styles'
      ],
      test: [
        'compass',
        'copy:styles'
      ],
      dist: [
        'compass:dist',
        'copy:styles',
        'htmlmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: true
      },
      unit_coverage: {
        background: false,
        configFile: 'karma-coverage.conf.js',
        autoWatch: false,
        singleRun: true,
        reporters: ['progress', 'coverage'],
        preprocessors: {
          'app/scripts/*.js': ['coverage']
        },
        coverageReporter: {
          type : 'html',
          dir : 'coverage/'
        }
      }
    },
    open: {
      devserver: {
        path: 'http://localhost:8888'
      },
      coverage: {
        path: 'http://localhost:5555'
      }
    },
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build:dist', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'configureProxies',
      'connect:livereload',
      'karma:unit:start',
      'watch'
    ]);
  });

  grunt.registerTask('coverage', ['karma:unit_coverage','open:coverage','connect:coverage']);
  grunt.registerTask('test:coverage', ['karma:unit_coverage']);
  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma:unit'
  ]);

  grunt.registerTask('deploy', [
    'build:dist',
    'shell:deploy'
  ]);

  grunt.registerTask('capybara', ['build:integration', 'shell:capybara']);

  grunt.registerTask('build:staging', [
    'build:dist',
    'shell:copy_to_staging'
  ]);

  grunt.registerTask('build:dist', [
    'clean:dist',
    'jade',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('build:integration', [
    'clean:dist',
    'jade:integration',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'shell:copy_to_integration'
  ]);

  grunt.registerTask('build:dev', [
    'clean:dist',
    'jade:dev',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build:dev'
  ]);
};
