module.exports = function (grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-bump');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bump: { options: { push: false } }
    });
};