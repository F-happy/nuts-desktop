/**
 * 编译选中的项目
 * @param workspace
 * @param config
 * Created by fuhuixiang on 16-8-28.
 */
"use strict";
const core          = require('gulp'),
      path          = require('path'),
      fs            = require('fs'),
      streamPlugin  = require('webpack-stream'),
      sassPlugin    = require('gulp-sass'),
      replacePlugin = require('gulp-replace-pro'),
      renamePlugin  = require('../util/rename'),
      getVersion    = require('../util/get_now_version'),
      taskIf        = require('../util/stream_if'),
      controller    = require('../controller');

let buildConfig = {},
    styleType   = 'css';

module.exports = (projectDir, config)=> {

    buildConfig = config;
    styleType = config.style === 'scss' ? 'scss' : 'css';

    // 判断参数是否合法
    getVersion(projectDir, (result) => {
        console.log(`正在部署的版本:${result}`);
        outDist(`${projectDir}/fd_dist/`, result, projectDir);
    });
};

/**
 * 通过命令行中的路径以及计算出最新版本号进行部署
 * @param buildDir
 * @param nowVersion
 * @param devDir
 */
function outDist(buildDir, nowVersion, devDir) {

    let distStaticDir = `${buildDir}/static/${nowVersion}`,
        staticURL     = buildConfig.needCDN ? buildConfig.staticURL : `../static`,
        buildCDNDir   = `${staticURL}/${path.basename(devDir)}/${nowVersion}`,
        buildName     = path.basename(buildDir);

    // 部署并压缩javaScript脚本文件
    core.src(`${devDir}/js/*.js`)
        .pipe(taskIf(buildConfig.target === 'ES6', streamPlugin(controller.webpackConfig())))
        .pipe(renamePlugin(`${buildName}.min.js`))
        .pipe(taskIf(buildConfig.needCDN, replacePlugin('(\.\.\/\i|\i)mages', `${buildCDNDir}/images`)))
        .pipe(replacePlugin({'@@replace': buildConfig.replaceStr || ''}))
        .pipe(core.dest(`${distStaticDir}/js/`));

    // 部署需要用到的图片，若没有图片则目录不存在
    // 部署需要用到的字体文件，若没有字体文件则目录不存在
    core.src(`${devDir}/images/**/*.*`)
        .pipe(core.dest(`${distStaticDir}/images/`));

    // 部署需要用到的字体文件，若没有字体文件则目录不存在
    core.src(`${devDir}/font/*.*`)
        .pipe(core.dest(`${distStaticDir}/font/`));

    // 部署并压缩需要用到的样式表文件，并且替换样式表中的本地资源为CDN资源
    let sassList  = buildConfig.sassLib || [],
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
    core.src(`${devDir}/${styleType}/*.${styleType}`)
        .pipe(taskIf(buildConfig.style === 'scss', sassPlugin({
            includePaths: inputList,
            outputStyle: 'compressed'
        })))
        .pipe(taskIf(buildConfig.needCDN, replacePlugin({
            '../images/': `${buildCDNDir}/images/`,
            '../font/': `${buildCDNDir}/font/`
        })))
        .pipe(core.dest(`${distStaticDir}/css/`));


    // 部署html文件，并替换文件中的静态资源
    core.src(`${devDir}/*.html`)
        .pipe(replacePlugin({
            'href="css/': `href="${buildCDNDir}/css/`,
            'src="js/': `src="${buildCDNDir}/js/`,
            'src="images/': `src="${buildCDNDir}/images/`
        }))
        .pipe(core.dest(`${devDir}/fd_dist`));
}
