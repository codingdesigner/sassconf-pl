module.exports = function (grunt) {
  require('time-grunt')(grunt); // shows how long grunt tasks take ~ https://github.com/sindresorhus/time-grunt
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    compass: {// https://github.com/gruntjs/grunt-contrib-compass
      options: {
        config: 'config.rb',
        bundleExec: true
      },
      compile: {
        // no options needed; default task
      },
      watch: {
        options: {
          watch: true
        }
      }
    },

    shell: {// https://github.com/sindresorhus/grunt-shell
      pattern_lab_build: {
        command: 'php core/builder.php --generate --nocache'
      },
      pattern_lab_watch: {
        command: 'php core/builder.php --watch --autoreload --nocache'
      },
      update_bundler: {
        command: 'bundle install'
      },
      update_bower: {
        command: 'bower install'
      },
      update_node: {
        command: 'npm install'
      },
      deploy: {
        command: 'bash scripts/deploy.sh'
      },
      trigger_reload: {
        command: 'touch change-to-reload.txt'
      },
      report_pattern_states: {
        command: 'cd source/_patterns/ && find . -name "*@*.mustache"'
      },
      report_partials: {
        command: 'cd source/_patterns/ && grep -rin "{{>" . | sed "s,.*{>,,g" | sed "s,(.*,,g" | sed "s,}.*,,g" | tr -d " " | sort | uniq -c | sort -rn'
      }
    },

    connect: {// https://www.npmjs.org/package/grunt-contrib-connect
      server: {
        options: {
          port: 9001,
          useAvailablePort: true,
          base: 'public',
          keepalive: true,
          livereload: true,
          open: true
        }
      }
    },

    watch: {// https://github.com/gruntjs/grunt-contrib-watch
      source: {
//        options: {
//          spawn: false
//        },
        files: [
          'source/**/*',
          '!**/source/scss/**', // watch:scss has this
          '!**/source/css/**', // watch:scss has this
          '!**/source/images/icons/src/**', // watch:icons has this
          '!**/source/images/icons/templates/*', // watch:icons has this
          '!**/source/images/icons/unused-library/*', // watch:icons has this
          //'!**/source/images/icons/output/**', // watch:icons has this
          '!**/bower_components/**' // IGNORE bower_components
        ],
        tasks: [
          'shell:pattern_lab_build',
          'shell:trigger_reload'
        ]
      },
      scss: {
        files: [
          'source/scss/**/*.scss'
        ],
        tasks: [
          'compass:compile',
          'newer:pattern_lab_component_builder',
          'shell:pattern_lab_build',
          'shell:trigger_reload'
        ]
      },
      reloader: {
        options: {
          livereload: true
        },
        files: ['change-to-reload.txt']
      },
      icons: {
        files: [
          'source/images/icons/src/**/*',
          'source/images/icons/templates/*'
        ],
        tasks: ['create_font_icons']
      },
      js_for_errors: {
        files: ['source/js/script.js'],
        tasks: ['jshint:js']
      }
    },

    parallel: {// https://www.npmjs.org/package/grunt-parallel
      watch: {
        tasks: [
          {
            grunt: true,
            stream: false,
            args: ['connect:server']
          },
          {
            grunt: true,
            stream: true,
            args: ['watch:scss']
          },
          {
            grunt: true,
            stream: true,
            args: ['watch:source']
          },
          {
            grunt: true,
            stream: false,
            args: ['watch:reloader']
          },
          {
            grunt: true,
            stream: true,
            args: ['watch:js_for_errors']
          },
          {
            grunt: true,
            stream: true,
            args: ['watch:icons']
          }
        ]
      }
    },

    jshint: {// https://www.npmjs.org/package/grunt-contrib-jshint
      options: {
        jshintrc: true // change settings in `.jshintrc`
      },
      js: {
        src: ['source/js/script.js']
      }
    },

    webfont: {// https://github.com/sapegin/grunt-webfont
      icons: {
        src: 'source/images/icons/src/*.svg',
        dest: 'source/images/icons/output/fonts',
        destCss: 'source/scss/global/icons',
        options: {
          engine: "node",
          stylesheet: 'scss',
          relativeFontPath: '../images/icons/output/fonts/',
          template: 'source/images/icons/templates/icons.template.css',
          htmlDemo: true,
          htmlDemoTemplate: 'source/images/icons/templates/08-icons.html',
          destHtml: 'source/_patterns/00-atoms/05-images/',
          hashes: false
        }
      }
    },

    notify: {// https://github.com/dylang/grunt-notify
      build: {
        options: {
          message: 'Build Complete'
        }
      },
      done: {
        options: {
          message: 'Done!'
        }
      }
    },

    prompt: {// https://github.com/dylang/grunt-prompt

    },

    open: {
      dev: {
        path: 'public/index.html',
        app: 'Google Chrome'
      },
      stage: {
        path: 'http://mac.elc.p2devcloud.com/',
        app: 'Google Chrome'
      },
      repo: {
        path: 'https://bitbucket.org/phase2tech/pattern-lab-elc-mac'
      },
      jira: {
        path: 'https://elcjira.atlassian.net/browse/MAC'
      },
      config_grunt: {
        path: 'Gruntfile.js'
      },
      config_bundler: {
        path: 'Gemfile'
      },
      config_compass: {
        path: 'config.rb'
      },
      config_bower: {
        path: 'bower.json'
      },
      edit_readme: {
        path: 'README.md'
      },
      pl_docs: {
        path: "http://patternlab.io/docs/index.html"
      }
    },

    pattern_lab_component_builder: {
      //colors: {
      //  options: {
      //    'regex': "^\\$color--.*",
      //    'allow_var_values': false
      //  },
      //  src: 'source/scss/global/variables/_colors.scss',
      //  dest: 'source/_patterns/00-atoms/01-global/00-colors.json'
      //},
      //fonts: {
      //  options: {
      //    'regex': "^\\$type.*"
      //  },
      //  src: "source/scss/global/variables/_type-sizes.scss",
      //  dest: "source/_patterns/00-atoms/02-text/02-type-sizes.json"
      //},
      breakpoints: {
        options: {
          // default is to find all sass vars
        },
        src: "source/scss/global/variables/_breakpoints.scss",
        dest: "source/_patterns/01-molecules/01-layout/99-breakpoints.json"
      },
      animations: {
        options: {
          'regex': "^\\$default-tra.*"
        },
        src: "source/scss/global/variables/_settings.scss",
        dest: "source/_patterns/00-atoms/01-global/04-animations.json"
      }
    },

    wiredep: {

      target: {

        // Point to the files that should be updated when you run `grunt wiredep`
        src: [
          'source/_patterns/00-atoms/00-meta/**/*.mustache'
        ],

        // Optional:
        // ---------
        directory: '',
        cwd: '',
        dependencies: true,
        devDependencies: false,
        // ignore js files used for IE shims, inject manually
        exclude: [
          '/bower_components/html5shiv/dist/html5shiv.js',
          '/bower_components/respond/dest/respond.src.js',
          '/bower_components/selectivizr/selectivizr.js',
          '/bower_components/select2/select2.css',
          '/bower_components/sidr/index.js'
        ],
        fileTypes: {},
        ignorePath: '../../..', // this let's us ignore all the relative pathing
        overrides: {}
      }
    },

    newer: {// https://github.com/tschaub/grunt-newer
      // In most cases, simply prepending `newer:` to a task, will make it only run if `src` is newer than `dest`; or if `src` is newer than last successful run. In a few other situations, we set options here.
//      options: {
//        override: function(detail, include) {
//          if (detail.task === 'compass') {
//            checkForModifiedImports(detail.path, detail.time, include);
//          } else {
//            include(false);
//          }
//        }
//      }

    }

  });

  require('load-grunt-tasks')(grunt); // loads ALL dependencies in package.json. So this is not needed: `grunt.loadNpmTasks('grunt-contrib-connect');`

  // just playing around
//    grunt.registerTask('test_listen', "testing listen for an event to fire", function() {
//        grunt.event.on('test-event', function() {
//          grunt.log.subhead("MY TEST EVENT FIRED!!");
//        });
//      grunt.log.writeln("May of just regestered a listener...");
//      grunt.task.run('compass:compile');
//      grunt.event.emit('test-event');
//    });

//
//    grunt.task.registerTask('foo', 'A sample task that logs stuff.', function(arg1, arg2) {
//        if (arguments.length === 0) {
//            grunt.log.writeln(this.name + ", no args");
//        } else {
//            grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
//        }
//    });

  grunt.registerTask('plcb', 'pattern_lab_component_builder');
  grunt.registerTask('cleanup_font_icon_build', 'Renaming some stuff', function () {
    grunt.file.copy('source/_patterns/00-atoms/05-images/icons.html', 'source/_patterns/00-atoms/05-images/icons.mustache');
    grunt.file.delete('source/_patterns/00-atoms/05-images/icons.html');
  });

  grunt.registerTask('watch_compass', 'compass:watch');
  grunt.registerTask('watch_pl', 'shell:pattern_lab_watch');
  grunt.registerTask('build', [
    'update',
    'newer:pattern_lab_component_builder',
    'compass:compile',
    'wiredep',
    'shell:pattern_lab_build',
    'shell:trigger_reload',
    'notify:build'
  ]);
  grunt.registerTask('update', [
    'shell:update_bundler',
    'shell:update_node',
    'shell:update_bower'
  ]);
  grunt.registerTask('deploy', [
    'shell:deploy',
    'notify:done'
  ]);
  grunt.registerTask('create_font_icons', [
    'webfont:icons',
    'cleanup_font_icon_build'
  ]);

  grunt.registerTask('default', [
    'build',
    'parallel:watch'
  ]);
};





