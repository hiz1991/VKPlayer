// /*Elixir Task
//  *copyrights to https://github.com/HRcc/laravel-elixir-angular
//  */
var gulp = require('gulp');
// var concat = require('gulp-concat');
// var sourcemaps = require('gulp-sourcemaps');
// var jshint = require('gulp-jshint');
// //var stylish = require('jshint-stylish');
// var uglify = require('gulp-uglify');
// var ngAnnotate = require('gulp-ng-annotate');
var notify = require('gulp-notify');
// var gulpif = require('gulp-if');

var Elixir = require('laravel-elixir');
shell  = require('gulp-shell');

var Task = Elixir.Task;

// Elixir.extend('angular', function(src, output, outputFilename) {

//     var baseDir = src || Elixir.config.assetsPath + '/angular/';

//     new Task('angular in ' + baseDir, function() {
//         // Main file has to be included first.

//         var gulpSrc = [
//             baseDir + "**/*module*.js",
//             baseDir + "**/*provider*.js",
//             baseDir + "**/*.js"
//         ];

//         if (Array.isArray(src)) {
//             gulpSrc = src;
//         }

//         return gulp.src(gulpSrc)
//             //.pipe(jshint())
//             //.pipe(jshint.reporter(stylish))
//             //.pipe(jshint.reporter('fail')).on('error', onError) //enable this if you want to force jshint to validate
//             // .pipe(gulpif(! config.production, sourcemaps.init()))
//             // .pipe(concat(outputFilename || 'app.js'))
//             // .pipe(ngAnnotate())
//             // .pipe(gulpif(config.production, uglify({mangle: false})))
//             // .pipe(gulpif(! config.production, sourcemaps.write()))
//             // .pipe(gulp.dest(output || config.js.outputFolder))
//             .pipe(notify({
//                 title: 'Laravel Elixir',
//                 subtitle: 'Angular Compiled!',
//                 icon: __dirname + '/../node_modules/laravel-elixir/icons/laravel.png',
//                 message: ' '
//             }));

//     }).watch(baseDir + '/**/*.js');

// });
// 
// 
// 
// 
// 
// 
var exec = require('child_process').exec;
// Elixir.extend("upload", function(src) {
// 	var baseDir = src || Elixir.config.assetsPath + '/resources/';
//     new Task("upload", function(){
// 	    	return gulp.task('task', function (cb) {
// 	     	 exec('./run.sh', function (err, stdout, stderr) {
// 	     	   console.log(stdout);
// 	     	   console.log(stderr);
// 	     	   cb(err);
// 	      })
// 	    })
	    
//     })
//     // .watch(baseDir + '/**/*.js');
// });
// 
// 
// 
// 



// var gulp = require('gulp');
// var shell = require('gulp-shell');
// var Elixir = require('laravel-elixir');

// var Task = Elixir.Task;
// var path = require("path"),
//     fs = require("fs");

var parentFolder  = __dirname.replace("/dev/tasks", "")
Elixir.extend('speak', function(message) {

    new Task('speak', function() {
    	// console.log("Somethung")
	      // exec(parentFolder+'/run.sh', function (err, stdout, stderr) {
	      exec('cp -r '+parentFolder+'/dev/public/ '+parentFolder+'/public & parse deploy', function (err, stdout, stderr) {
	     	   console.log(stdout);
	     	   console.log(stderr);
	     	   // cb(err);
	      })
    	// 	      
        return gulp.src('').pipe(shell('say ' + message)).pipe(
	        	notify({
	        	                title: 'Parse uploaded',
	        	                subtitle: 'Parse uploaded',
	        	                icon: __dirname + '/../node_modules/laravel-elixir/icons/laravel.png',
	        	                message: ' '
	        	       })
            );

    })

})

// mix.speak('Hello World');