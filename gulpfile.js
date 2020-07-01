const gulp = require('gulp');
const sass = require( 'gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const browserify = require("browserify");
const babelify = require("babelify");
const plumber = require('gulp-plumber');
const source = require("vinyl-source-stream");
const exec = require('child_process').exec;

const paths = {
  javascripts: {
    src: 'src/javascripts/**/*.js',
    mnanifest: 'src/javascripts/application.js',
    dist: 'src/site/assets/javascripts'
  },
  stylesheets: {
    src: ['src/stylesheets/**/*.scss'],
    dist: 'src/site/assets/stylesheets'
  },
  fonts: {
    src: ['src/fonts/**/*'],
    dist: 'src/site/assets/fonts'
  },
  images: {
    src: 'src/images/**/*',
    dist: 'src/site/assets/images'
  },
  dist: 'src/site/assets'
};

const stylesheets = () => {
  return gulp.src(paths.stylesheets.src)
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(sass({ outputStyle: 'extended', errLogToConsole: true }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(csso({
      restructure: true,
      sourceMap: true,
      debug: true
    }))
    .pipe(gulp.dest(paths.stylesheets.dist))
};

const fonts = () => {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dist));
};

const images = () => {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dist));
};

const javascripts = () => {
  return browserify({
    entries: [paths.javascripts.mnanifest],
    transform: [babelify.configure({ presets: ["@babel/preset-env"] })]
  })
  .bundle()
  .pipe(source('application.js'))
  .pipe(gulp.dest(paths.javascripts.dist))
};

const javascriptTests = (cb) => {
  exec('npm run test', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

gulp.task('watch', () => {
  gulp.watch(paths.stylesheets.src, stylesheets);
  gulp.watch(paths.javascripts.src, gulp.parallel(javascriptTests, javascripts));
});

gulp.task('default', gulp.parallel(javascripts, stylesheets, images, fonts));
