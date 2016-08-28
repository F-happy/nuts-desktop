/**
 * Created by fuhuixiang on 16-8-27.
 */
"use strict";
const core           = require('gulp'),
      path           = require('path'),
      plumberPlugin  = require('gulp-plumber'),
      connectPlugin  = require('gulp-connect'),
      wpStreamPlugin = require('webpack-stream'),
      renamePlugin   = require('gulp-rename'),
      compassPlugin  = require('gulp-sass'),
      replacePlugin  = require('gulp-replace-pro'),
      controller     = require('../controller');

module.exports = (projectDir)=> {

    // 第一次初始化运行编译,后面则交个 watch 任务。
    compassSass(`${projectDir}/scss/*.scss`, `${projectDir}/fd_dev/css/`);
    es6ToEs5(`${projectDir}/js/*.js`, `${projectDir}/fd_dev/js`, path.basename(projectDir));
    compassFile(`${projectDir}/*.html`, `${projectDir}/fd_dev/`);

    // 自动化部署任务
    core.watch([`${projectDir}/scss/*.scss`, `${projectDir}/js/*.js`, `${projectDir}/*.html`], ()=> {
        //监控样式表是否改动
        compassSass(`${projectDir}/scss/*.scss`, `${projectDir}/fd_dev/css/`);

        //监控js代码是否改变
        es6ToEs5(`${projectDir}/js/*.js`, `${projectDir}/fd_dev/js`, path.basename(projectDir));

        // 监控静态文件是否变更
        compassFile(`${projectDir}/*.html`, `${projectDir}/fd_dev/`);
    });
};

/**
 * 对项目中的scss文件进行编译
 * @param input
 * @param output
 */
function compassSass(input, output) {
    core.src(input)
        .pipe(plumberPlugin())
        .pipe(compassPlugin({
            includePaths: require('nuts-scss').includePaths
            // includePaths: constConfig.sassLib
        }))
        .pipe(connectPlugin.reload())
        .pipe(core.dest(output));
}

/**
 * 更具项目来判断是否进行es6的转换
 * @param input
 * @param output
 * @param proName
 */
function es6ToEs5(input, output, proName) {
    core.src(input)
        .pipe(plumberPlugin())
        .pipe(wpStreamPlugin(controller.webpackConfig('dev')))
        .pipe(renamePlugin(`${proName}.min.js`))
        .pipe(replacePlugin('@@androidVer', constConfig.androidVer))
        .pipe(connectPlugin.reload())
        .pipe(core.dest(output));
}

/**
 * 静态文件的编译
 * @param input
 * @param output
 */
function compassFile(input, output) {
    core.src(input)
        .pipe(plumberPlugin())
        .pipe(connectPlugin.reload())
        .pipe(core.dest(output));
}
