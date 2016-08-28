/**
 * 引入静态资源任务
 * Created by fuhuixiang on 16-8-28.
 */
"use strict";
const firFiles      = require('../util/get_dir_file'),
      replacePlugin = require('gulp-replace-pro'),
      core          = require('gulp'),
      fs            = require('fs');

controller.packages._core.task('include', ()=> {

    let proName     = controller.arguments()._name,
        devDir      = `${controller.config.sourceDir}/${proName}`,
        _staticData = '';

    if (!proName) {
        console.log('请输入项目名称');
        return null;
    }
    /**
     * 读取 images 文件夹下所有的文件的相对路径,
     * 然后通过正则匹配出文件名,然后新建出静态资源文件进行存储
     * 最后在主 scss 文件中引入新建的静态资源文件。
     */
    firFiles(`${devDir}/images/`, (err, files)=> {
        if (err) {
            console.log(`${err.path}目录不存在`);
            return null;
        }
        files.forEach((v)=> {
            let _name = v.split(`${devDir}/images/`)[1];
            _staticData += `$${_name.match(/(\w+)\.\w+$/)[1].replace(/_/g, '-')}: url(../images/${_name}); \n`;
        });
        if (!!_staticData) {
            fs.appendFile(`${devDir}/scss/_static.scss`, _staticData, 'utf8', (err)=> {
                if (err) {
                    console.log(err);
                } else {
                    console.log('_static文件创建完成');
                    core.src(`${devDir}/scss/${controller.config.activity ? proName.split('/')[1] : proName}.scss`)
                        .pipe(replacePlugin({
                            '@charset "utf-8";': `@charset "utf-8";\n@import "static";`,
                        }))
                        .pipe(core.dest(`${devDir}/scss/`));
                }
            });
        } else {
            console.log(`目录内没有静态资源`);
        }
    });
});
