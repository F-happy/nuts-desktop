/**
 * Created by fuhuixiang on 16-10-9.
 */
"use strict";
const path = require('path');
const controller = require('../controller');

module.exports = (projectPath, callback = ()=> {
})=> {
    let storage = controller.getStorage();
    let projectName = path.basename(projectPath);

    if (storage && storage['workspace']) {
        if (!storage['projects']) {
            storage['projects'] = {};
        }

        if (storage['projects'][projectName]) {
            alert('项目已存在');
        } else {
            storage['projects'][projectName] = {};
            storage['projects'][projectName]['path'] = projectPath;
            controller.setStorage(storage);

            //插入打开的项目
            // insertOpenProject({projectPath: {path: projectPath}});
            callback(projectName);
        }
    }
};
