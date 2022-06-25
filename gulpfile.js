const { src, dest, series } = require('gulp');
const gulp = require('gulp');
const minify = require("gulp-minify");
const concat = require("gulp-concat");
const htmlmin = require("gulp-htmlmin");
const replace = require("gulp-string-replace");
const htmlreplace = require("gulp-html-replace");
const cleanCSS = require("gulp-clean-css");
const plugins = require('gulp-load-plugins')();
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const closureCompiler = require('google-closure-compiler').gulp();
const zip = require('gulp-zip');
const advzip = require('gulp-advzip');
const checkFileSize = require('gulp-check-filesize');

const replaceOptions = { logs: { enabled: false } };

const thirteenKb = 13 * 1024; // filesize limit

const title = "WinWin";
const debug = false; // debug service worker messages

const gameContainer = 'gameContainer';

// compress icons, compile js, minify css and webmanifest
function mini(cb) {
	var num = 0;
	src('src/icon_224.png')
		//.pipe(plugins.imagemin([imageminWebp({ method: 6 })]))
		.pipe(concat('ico.png'))
		.pipe(dest('public/'))
		.on("end", checkCompletion)
	&&
		src(['src/service_worker.js'], { allowEmpty: true })
		.pipe(replace('var debug;', 'var debug = ' + debug + ';', replaceOptions))
		.pipe(replace('JS13k', 'js13k_' + getDateString(true), replaceOptions))
		.pipe(replace('caches', 'window.caches', replaceOptions))
		.pipe(closureCompiler({
			compilation_level: 'ADVANCED_OPTIMIZATIONS',
			warning_level: 'QUIET',
			language_in: 'ECMASCRIPT6',
			language_out: 'ECMASCRIPT6'
		}))
		.pipe(replace('window.caches', 'caches', replaceOptions))
		.pipe(replace('icon_224', 'ico', replaceOptions))
		.pipe(replace("'use strict';", '', replaceOptions))
		.pipe(minify({ noSource: true }))
		.pipe(concat('sw.js'))
		.pipe(dest('public/'))
		.on("end", checkCompletion)
	&&
		src([
			'src/scripts/classes/Missile.js',
			'src/scripts/classes/PlayerMissile.js',
			'src/scripts/classes/PlayerCannon.js',
			'src/scripts/classes/PlayerLaser.js',
			'src/scripts/classes/PlayerBlob.js',
			'src/scripts/classes/EnemyMissile.js',
			'src/scripts/*.js'
		], { allowEmpty: true })
		.pipe(minify({ noSource: true }))
		.pipe(concat('temp.js'))
		.pipe(replace('var debug;', 'var debug = ' + debug + ';', replaceOptions))
		.pipe(replace('service_worker.js', 'sw.js', replaceOptions))
		//.pipe(replace(gameContainer, 'window.' + gameContainer, replaceOptions))
		.pipe(closureCompiler({
			compilation_level: 'ADVANCED_OPTIMIZATIONS',
			warning_level: 'QUIET',
			language_in: 'ECMASCRIPT6',
			language_out: 'ECMASCRIPT6'
		}))
		//.pipe(replace('window.a', gameContainer, replaceOptions))
		.pipe(replace("'use strict';", '', replaceOptions))
		.pipe(minify({ noSource: true }))
		.pipe(concat('temp.js'))
		.pipe(dest('tmp/'))
		.on("end", checkCompletion)
	&&
		src('src/styles/*.css', { allowEmpty: true })
		.pipe(cleanCSS())
		.pipe(concat('temp.css'))
		.pipe(dest('tmp/'))
		.on("end", checkCompletion)
	&&
		src('src/index.html', { allowEmpty: true })
		.pipe(htmlreplace({
			'social': '',
			'ios': '',
			'css': 'rep_cs',
			'js': 'rep_js'
		}))
		.pipe(concat('temp.html'))
		.pipe(dest('tmp/'))
		.on("end", checkCompletion)
	&&
		src('src/mf.webmanifest', { allowEmpty: true })
		.pipe(replace('service_worker', 'sw', replaceOptions))
		.pipe(replace('icon_224', 'ico', replaceOptions))
		.pipe(replace('JS13k 2020', title, replaceOptions))
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest('public/'))
		.on("end", checkCompletion);

	function checkCompletion(){
		if (num < 5) num ++;
		else cb();
	}
}

// inline js and css into the html and remove unnecessary stuff
function pack(cb) {
	var fs = require('fs');
	src('tmp/temp.html', { allowEmpty: true })
		.pipe(replace('JS13k 2020', title, replaceOptions))
		.pipe(replace('<html lang="en">', '', replaceOptions))
		.pipe(replace('<meta charset="UTF-8">', '', replaceOptions))
		.pipe(replace('minimum-scale=1,maximum-scale=1,', '', replaceOptions))
		.pipe(replace('icon_180', 'ico', replaceOptions))
		.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
		.pipe(replace('"', '', replaceOptions))
		.pipe(replace('rep_cs', '<style>' + fs.readFileSync('tmp/temp.css', 'utf8') + '</style>', replaceOptions))
		.pipe(replace('rep_js', '<script>' + fs.readFileSync('tmp/temp.js', 'utf8') + '</script>', replaceOptions))
		.pipe(replace('document.s', 'document.monetization', replaceOptions))
		.pipe(concat('index.html'))
		.pipe(dest('public/'))
		.on("end", cb);
}

// package zip and output filesize
function createZip(cb) {
	src(['public/*/*', 'public/*'])
		.pipe(zip('game_' + getDateString() + '.zip'))
		//.pipe(advzip({ optimizationLevel: 4, iterations: 100 }))
		.pipe(dest('zip'))
		.pipe(checkFileSize({ fileSizeLimit: thirteenKb }))
		.on("end", cb);
}

// helper function
function getDateString(shorter) {
	const date = new Date();
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, '0');
	const day =`${date.getDate()}`.padStart(2, '0');
	if (shorter) return `${year}${month}${day}`;
	const signiture =`${date.getHours()}`.padStart(2, '0')+`${date.getMinutes()}`.padStart(2, '0')+`${date.getSeconds()}`.padStart(2, '0');
	return `${year}${month}${day}_${signiture}`;
}

// exports
exports.mini = mini;
exports.pack = pack;
exports.default = series(mini, pack, createZip);
