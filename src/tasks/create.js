/**
 * 从初始化文件夹中复制出需要用到的html，scss和js文件
 * 这个命令只在初始化一个项目时使用，需要本地模板文件支持，其他同事请无视这条命令，谢谢！
 * Created by jonnyf on 16-8-26.
 */
'use strict';
const fs            = require("fs"),
      path          = require('path'),
      core          = require('gulp'),
      renamePlugin  = require('gulp-rename'),
      replacePlugin = require('gulp-replace-pro'),
      time          = require('../util/date_format');

module.exports = (projectName)=> {
    let projectDir = path.join(workspace, projectName);
    fs.exists(projectDir, (msg)=> {
        if (msg) {
            console.log(msg);
        } else {
            createProject(projectDir, projectName);
        }
    });
};

function createProject(projectDir, projectName) {
    let letter_name = projectName.replace(/\_(\w)/g, (all, letter)=> {
        return letter.toUpperCase();
    });

    let templatesPath = path.join(__dirname, '../../templates/');
    core.src(`${templatesPath}/index.html`)
        .pipe(replacePlugin('@@main', projectName))
        .pipe(core.dest(`${projectDir}/`));

    core.src(`${templatesPath}/scss/main.scss`)
        .pipe(renamePlugin(`${projectName}.scss`))
        .pipe(core.dest(`${projectDir}/scss`));

    core.src(`${templatesPath}/js/main.tmpl`)
        .pipe(replacePlugin({
            '@@project_name': projectName,
            '@@author': constConfig.author,
            '@@date': time,
            '@@project': letter_name.replace(/(\w)/, v=> v.toUpperCase()),
            '@@letter': letter_name
        }))
        .pipe(renamePlugin(`${projectName}.js`))
        .pipe(core.dest(`${projectDir}/js`));

    // 创建图片和字体文件夹
    fs.mkdir(projectDir, (err) => {
        if (err) {
            console.log(err);
        }
        fs.mkdirSync(`${projectDir}/images`);
        fs.mkdirSync(`${projectDir}/font`);
    });
}
