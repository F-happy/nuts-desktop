/**
 * Created by fuhuixiang on 16-10-17.
 */
"use strict";
const path = require('path');
const controller = require(`${__dirname}/src/controller`);

module.exports.store = {
    settingProjectName: 'global'
};

module.exports.openProject = (projectPath, callback)=> {
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

// fdFlow = {
//     "workspace": "/Users/fuhuixiang/fdFlow_workspace", "projects": {
//         "welcome_example": {
//             "path": "/Users/fuhuixiang/fdFlow_workspace/welcome_example"
//         }
//         ,
//         "welcome_example2": {
//             "path": "/Users/fuhuixiang/fdFlow_workspace/welcome_example"
//         }
//     }
// };
