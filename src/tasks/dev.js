/**
 * Created by fuhuixiang on 16-8-27.
 */
"use strict";
const core          = require('gulp'),
      path          = require('path'),
      fs            = require('fs'),
      plumberPlugin = require('gulp-plumber'),
      connectPlugin = require('gulp-connect'),
      streamPlugin  = require('webpack-stream'),
      sassPlugin    = require('gulp-sass'),
      replacePlugin = require('gulp-replace-pro'),
      renamePlugin  = require('../util/rename'),
      controller    = require('../controller');

let devConfig  = {},
    devDirList = [];

module.exports = (projectDir, config)=> {

    devConfig = config;
    //初始化函数
    devDirList = fs.readdirSync(projectDir);
    if (devDirList.indexOf('scss') != -1) {
        compassSass(`${projectDir}/scss/*.scss`, `${projectDir}/fd_dev/css`);
    } else {
        console.log('scss路径不存在');
    }

    if (devDirList.indexOf('js') != -1) {
        es6ToEs5(`${projectDir}/js/*.js`, `${projectDir}/fd_dev/js`, path.basename(projectDir));
    } else {
        console.log('js路径不存在');
    }
    if (devDirList.indexOf('images') != -1) {
        compassFile(`${projectDir}/images/**/*.*`, `${projectDir}/fd_dev/images`);
    } else {
        console.log('图片路径不存在');
    }

    if (devDirList.indexOf('font') != -1) {
        compassFile(`${projectDir}/font/*.*`, `${projectDir}/fd_dev/font`);
    } else {
        console.log('字体路径不存在');
    }
    compassFile(`${projectDir}/*.html`, `${projectDir}/fd_dev/`);

    // 监听文件变动
    return taskWatch(projectDir, `${projectDir}/fd_dev/`, path.basename(projectDir));
};

/**
 * 文件变动函数
 * @param devDir
 * @param outDir
 * @param proName
 */
function taskWatch(devDir, outDir, proName) {

    let watcher = [];
    //监控js代码是否改变
    watcher.push(core.watch(`${devDir}/js/*.js`).on('all', (event, filePath, stats)=> {
        console.log(`文件 ${filePath} 触发 ${event} 事件，重新编译中。。。`);
        es6ToEs5(filePath, `${outDir}/js`, path.basename(proName));
    }));

    //监控样式表是否改动
    watcher.push(core.watch(`${devDir}/scss/*.scss`).on('all', (event, filePath, stats)=> {
        console.log(`文件 ${filePath} 触发 ${event} 事件，重新编译中。。。`);
        compassSass(filePath, `${outDir}/css`);
    }));

    // 监控静态文件是否变更
    watcher.push(core.watch(`${devDir}/*.html`).on('all', (event, filePath, stats)=> {
        console.log(`文件 ${filePath} 触发 ${event} 事件，重新编译中。。。`);
        compassFile(filePath, outDir);
    }));

    return watcher;
}

/**
 * 对项目中的scss文件进行编译
 * @param input
 * @param output
 */
function compassSass(input, output) {
    let sassList  = devConfig.sassLib || [],
        inputList = [];
    sassList.forEach((v)=> {
        if (!!path.parse(v).dir) {
            inputList.push(v);
        } else {
            try {
                inputList = inputList.concat(require(v).includePaths);
            } catch (err) {
                console.log(`没有找到 ${v} 库`);
            }
        }
    });
    core.src(input)
        .pipe(plumberPlugin())
        .pipe(sassPlugin({includePaths: inputList}))
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
        .pipe(streamPlugin(controller.webpackConfig('dev')))
        .pipe(renamePlugin(`${proName}.min.js`))
        .pipe(replacePlugin('@@replace', devConfig.replaceStr || ''))
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
