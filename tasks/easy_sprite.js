/*
 * grunt-easy-sprite
 * https://github.com/vinnyguitar/grunt-easy-sprite
 *
 * Copyright (c) 2015 vinnyguitar
 * Licensed under the MIT license.
 */

'use strict';

var sprite = require('easy-sprite');
var q = require('q');
var path = require('path');

module.exports = function(grunt) {

    grunt.registerMultiTask('easy_sprite', 'Grunt plugin for easy-sprite', function() {
        var done = this.async();
        var options = this.options({
            margin: 10,
            compress: false,
            sourcemap: false
        });
        if(!options.spriteDir) {
            grunt.log.error('spriteDir must specific');
        }

        grunt.file.mkdir(options.spriteDir);

        var promises = [];
        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            grunt.file.mkdir(path.dirname(f.dest));
            // Concat specified files.
            var src = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                return sprite({
                        src: filepath,
                        dest: f.dest,
                        spriteDir: options.spriteDir,
                        margin: options.margin,
                        compress: options.compress,
                        sourcemap: options.sourcemap
                    }, function(err) {
                        if(!err) {
                            grunt.log.writeln('File "' + f.dest + '" created.');
                        } else {
                            grunt.log.warn(filepath + ' sprite error.');
                        }
                    });
            });
            Array.prototype.push.apply(promises, src);
        });
        q.all(promises)
            .then(function() {
                done();
            }, function(err) {
                done(err);
            });

    });

};
