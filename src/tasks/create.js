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
      mkdirs        = require('../util/mkdirs'),
      timeFormat    = require('../util/date_format');

module.exports = (projectName)=> {
    let projectDir = path.join(workspace, projectName);
    fs.exists(projectDir, (msg)=> {
        if (msg) {
            console.log('警告！！！您要创建的项目已经存在！');
            return null;
        } else {
            let create = createProject(projectDir, projectName);
            create.next();
            console.log('HTML文件创建完成！！！');
            create.next();
            console.log('样式文件创建完成！！！');
            create.next();
            console.log('脚本文件创建完成！！！');
            if (create.next().done) {
                console.log(`${projectName}项目创建完成！！！`);
            }
        }
    });
};

function* createProject(devDir, name) {

    let letterName = name.replace(/\_(\w)/g, (all, letter)=> {
        return letter.toUpperCase();
    });

    let templetPath = path.join(__dirname, '../../templates/');
    yield core.src(`${templetPath}/index.html`)
        .pipe(replacePlugin({
            '@@main': name,
            '@@title': config.title
        }))
        .pipe(core.dest(`${devDir}/`));

    yield core.src(`${templetPath}/scss/main.scss`)
        .pipe(renamePlugin(`${name}.scss`))
        .pipe(core.dest(`${devDir}/scss`));

    yield core.src(`${templetPath}/js/main.tmpl`)
        .pipe(replacePlugin({
            '@@project_name': name,
            '@@author': config.author,
            '@@date': timeFormat,
            '@@project': letterName.replace(/(\w)/, v=> v.toUpperCase()),
            '@@letter': letterName
        }))
        .pipe(renamePlugin(`${name}.js`))
        .pipe(core.dest(`${devDir}/js`));

    // 创建图片和字体文件夹
    return mkdirs(path.resolve(process.cwd(), devDir), (dir)=> {
        fs.mkdirSync(`${dir}/images`);
        fs.mkdirSync(`${dir}/font`);
    });
}
