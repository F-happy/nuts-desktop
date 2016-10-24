/**
 * 引入静态资源任务
 * Created by fuhuixiang on 16-8-28.
 */
"use strict";
const firFiles      = require('../util/get_dir_file'),
      replacePlugin = require('gulp-replace-pro'),
      core          = require('gulp'),
      path          = require('path'),
      fs            = require('fs');

module.exports = (projectDir)=> {
    let proName      = path.basename(projectDir),
        firstInclude = true,
        _staticData  = '';

    /**
     * 读取 images 文件夹下所有的文件的相对路径,
     * 然后通过正则匹配出文件名,然后新建出静态资源文件进行存储
     * 最后在主 scss 文件中引入新建的静态资源文件。
     */
    firFiles(`${projectDir}/images/`, (err, files)=> {
        if (err) {
            console.log(`${err.path}目录不存在`);
            return null;
        }
        fs.readFile(`${projectDir}/scss/_static.scss`, 'utf8', (err, data)=> {
            if (!err) {
                _staticData = data.toString();
                firstInclude = false;
            }
            files.forEach((v)=> {
                let _name     = v.split(`${projectDir}/images/`)[1],
                    writeText = `$${_name.match(/(\w+)\.\w+$/)[1].replace(/_/g, '-')}: url(../images/${_name}); \n`;
                if (_staticData.indexOf(writeText) === -1) {
                    _staticData += writeText;
                }
            });
            if (!!_staticData) {
                fs.writeFile(`${projectDir}/scss/_static.scss`, _staticData, 'utf8', (err)=> {
                    if (err) {
                        console.log(err);
                    } else if (firstInclude) {
                        console.log('_static文件创建完成');
                        core.src(`${projectDir}/scss/${path.basename(proName)}.scss`)
                            .pipe(replacePlugin({
                                '@charset "utf-8";': `@charset "utf-8";\n@import "static";`,
                            }))
                            .pipe(core.dest(`${projectDir}/scss/`));
                    }
                });
            } else {
                console.log(`目录内没有静态资源`);
            }
        });
    });
};
