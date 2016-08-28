/**
 * Created by fuhuixiang on 16-8-28.
 */
"use strict";
const core           = require('gulp'),
      path           = require('path'),
      fs             = require('fs'),
      wpStreamPlugin = require('webpack-stream'),
      renamePlugin   = require('gulp-rename'),
      compassPlugin  = require('gulp-sass'),
      replacePlugin  = require('gulp-replace-pro'),
      getVersion     = require('../util/get_now_version'),
      taskIf         = require('../util/stream_if'),
      controller     = require('../controller');

module.exports = ()=> {

    // 判断参数是否合法
    if (!!buildDir) {
        fs.exists(devDir, (exists) => {
            if (exists) {
                if (!!buildVer) {
                    console.log('正在部署的版本:' + buildVer);
                    outDist(buildDir, buildVer, devDir);
                } else {
                    getVersion(buildDir, (result) => {
                        console.log('正在部署的版本:' + result);
                        outDist(buildDir, result, devDir);
                    });
                }
            } else {
                console.log('警告！！！没有您要部署的项目！');
            }
        });
    } else {
        console.log('请输入需要部署的活动路径!');
        return null;
    }
};

/**
 * 通过命令行中的路径以及计算出最新版本号进行部署
 * @param buildDir
 * @param nowVersion
 * @param devDir
 */
function outDist(buildDir, nowVersion, devDir) {
    let distStaticDir = `${_config.distDir}/${_config.staticDir}/${buildDir}/${nowVersion}`,
        staticURL     = _config.needCDN ? _config.staticURL : `../${_config.staticDir}`,
        buildCDNDir   = `${staticURL}/${buildDir}/${nowVersion}`,
        buildName     = _config.activity ? buildDir.split('/')[1] : buildDir;

    // 部署并压缩javaScript脚本文件
    core.src(`${devDir}/js/*.js`)
        .pipe(wpStreamPlugin(controller.webpackConfig()))
        .pipe(renamePlugin(`${buildName}.min.js`))
        .pipe(taskIf(_config.needCDN, replacePlugin('../images/', `${buildCDNDir}/images/`)))
        .pipe(replacePlugin({
            '@@androidVer': constConfig.androidVer,
            'images/': `${buildCDNDir}/images/`
        }))
        .pipe(core.dest(`${distStaticDir}/js/`));

    // 部署需要用到的图片，若没有图片则目录不存在
    core.src(`${devDir}/images/**/*.*`)
        .pipe(core.dest(`${distStaticDir}/images/`));

    // 部署需要用到的字体文件，若没有字体文件则目录不存在
    core.src(`${devDir}/font/*.*`)
        .pipe(core.dest(`${distStaticDir}/font/`));

    // 部署并压缩需要用到的样式表文件，并且替换样式表中的本地资源为CDN资源
    core.src(`${devDir}/scss/*.scss`)
        .pipe(compassPlugin({
            // includePaths: controller.config.sassLib,
            includePaths: require('nuts-scss').includePaths,
            outputStyle: 'compressed'
        }))
        .pipe(taskIf(_config.needCDN, replacePlugin({
            '../images/': `${buildCDNDir}/images/`,
            '../font/': `${buildCDNDir}/font/`
        })))
        .pipe(core.dest(`${distStaticDir}/css/`));

    // 部署html文件，并替换文件中的静态资源
    core.src(devDir + '/*.html')
        .pipe(replacePlugin({
            'href="css/': `href="${buildCDNDir}/css/`,
            'src="js/': `src="${buildCDNDir}/js/`,
            'src="images/': `src="${buildCDNDir}/images/`
        }))
        .pipe(core.dest(`${projectDir}/fd_dist`));
}
