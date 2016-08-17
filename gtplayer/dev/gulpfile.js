var gulp = require('gulp'),
    elixir = require('laravel-elixir'),
    concat = require('gulp-concat')
    minifier = require('gulp-uglify/minifier')
    ;

var config = elixir.config;
config.assetsPath = 'resources';

require('./tasks/angular.task.js');
//elixir.config.sourcemaps = false;


elixir(function (mix) {

    mix
        // bootstrap
        .copy('bower_components/bootstrap/dist/css/*.min.css', 'resources/css/bootstrap.min.css')
        .copy('bower_components/bootstrap/dist/fonts', 'public/fonts')

        // sass
        // .sass('style.scss')

        // angular
        // .angular([
        //     'bower_components/jquery/dist/jquery.min.js',
        //     'bower_components/bootstrap/dist/js/*.min.js',
        //     'bower_components/angular/angular.min.js',
        //     'bower_components/angular-ui-router/release/*min.js',
        //     'bower_components/angular-animate/*min.js',
        //     'bower_components/angular-aria/*min.js',
        //     'bower_components/angular-resource/*min.js',
        //     'bower_components/lodash/*min.js'
        // ], 'public/js', 'vendor.js')
        // .angular('resources/angular/app/', 'public/js', 'angular.js')

        // native JS
        // 
        // .scriptsIn('resources/js', 'public/js/scripts.js')
        .scripts(['resources/js/jquery.min.js',
                 'resources/js/parse-latest.js',
                 'resources/js/bootstrap.min.js',
                 // 'resources/js/angular.min.js',
                 'resources/js/TweenMax.min.js',
                 'resources/js/soundcloud-3.1.2.js',
                 'resources/js/bounceb.js',
                 'resources/js/spotify.js',
                 'resources/js/indexModel.js'], 'public/js/scripts.js')


        // vendor css
        // .styles(["*.css"], 'public/css/vendor.css')
        .styles(["resources/css/font-awesome.min.css", 
            "resources/css/bootstrap.min.css", 
            "resources/css/player.css",
            "resources/css/theme.css"], 
                 'public/css/vendor.css')
        .speak('Fuck yeah');
        // .upload("./resources")

        // .version(["public/css/*.css", "js/*.js"])
    ;

});


