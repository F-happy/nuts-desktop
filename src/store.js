/**
 * Created by fuhuixiang on 16-10-17.
 */
"use strict";
const path = require('path');
const controller = require(`${__dirname}/controller`);

// 开始导入命令脚本
const createTask = require(`${__dirname}/tasks/create`),
      delTask    = require(`${__dirname}/tasks/clean`),
      devTask    = require(`${__dirname}/tasks/dev`),
      serverTask = require(`${__dirname}/tasks/server`),
      buildTask  = require(`${__dirname}/tasks/build`);

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
            callback({storage, projectName});
        }
    }
};

module.exports.createTask = (projectName)=> {
    createTask(projectName);
};

module.exports.deleteProject = (delProjectPath, callback)=> {
    delTask(delProjectPath, (projectDir)=> {
        let storage = controller.getStorage();
        let storageProject = storage.projects;
        for (let i in storageProject) {
            if (i === path.basename(projectDir)) {
                delete storage.projects[i];
            }
        }
        controller.setStorage(storage);
        callback(storage);
    });
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
