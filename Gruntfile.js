module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        //Get some details from the package.json
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        ' * <%= pkg.name %> - version <%= pkg.version %> \n' +
        ' * <%= pkg.description %>\n' +
        ' *\n' +
        ' * <%= pkg.author %>\n' +
        ' * Build at <%= grunt.template.today("dd-mm-yyyy") %>\n' +
        ' * Released under MIT License \n' +
        ' */\n',
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: [ 'build/*.js' ]
                }
            }
        },
        //Typescript settings per build
        typescript: {
            options: {
                module: 'amd',
                target: 'es5',
                sourceMap: true,
                declaration: true,
                references: [
                    'vendor/*.d.ts',
                    'node_modules/phaser/typescript/pixi.d.ts',
                    'node_modules/phaser/typescript/phaser.d.ts'
                ],
                noImplicitAny: true
            },
            dist: {
                src: ['ts/**/*.ts'],
                dest: 'build/<%= pkg.name %>.js'
            }
        },
        watch: {
            files: ['ts/**/*.ts'],
            tasks: ['typescript'],
            options: {
                livereload: true
            }
        },
        connect: {
            server: {
                options: {
                    port: 8080
                }
            }
        },
        uglify: {
            options: {
                compress: {
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                    drop_console: false
                },
                mangle: true,
                beautify: false
            },
            dist: {
                files: {
                    'build/<%= pkg.name %>.min.js': [
                        'build/<%= pkg.name %>.js'
                    ]
                }
            }
        },
        clean: {
            dist: ['build']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //dist Build
    grunt.registerTask('dist', [
        'clean:dist',     //Clean the dist folder
        'typescript:dist',//Run typescript on the preprocessed files, for dist (client)
        'uglify:dist',    //Minify everything
        'usebanner:dist'    //Minify everything
    ]);

    grunt.registerTask('dev', [
        'typescript:dist',
        'connect',
        'watch'
    ]);

};
