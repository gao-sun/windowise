const gulp = require('gulp');
const minifyCss = require('gulp-clean-css');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const webpack2 = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');

const paths = {
	sass: 'src/sass/**/*.scss'
};

const getSass = () => {
	return gulp.src(paths.sass)
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 10 versions'],
			cascade: false
		}));
};

gulp.task('sass', function() {
	getSass()
		.pipe(rename('windowise.css'))
		.pipe(gulp.dest('dist/'));

	return getSass()
		.pipe(minifyCss())
		.pipe(rename('windowise.min.css'))
		.pipe(gulp.dest('dist/'));
});


gulp.task('app', function() {
	return gulp.src('')
		.pipe(webpackStream(webpackConfig, webpack2))
		.pipe(gulp.dest('dist/'));
});

// Whole build
gulp.task('build', ['sass', 'app']);

gulp.task('watch', function() {
	return gulp.watch(paths.sass, ['sass']);
});

gulp.task('default', ['build', 'watch']);