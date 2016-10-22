/**
 * Created by fuhuixiang on 16-10-17.
 */
"use strict";
const path = require('path');
const controller = require(`${__dirname}/controller`);
const isEmpty = require(`${__dirname}/util/is_empty_object`);

// 开始导入命令脚本
const createTask = require(`${__dirname}/tasks/create`),
      delTask    = require(`${__dirname}/tasks/clean`),
      devTask    = require(`${__dirname}/tasks/dev`),
      serverTask = require(`${__dirname}/tasks/server`),
      buildTask  = require(`${__dirname}/tasks/build`);

let watcherLists = {};

// 全局状态机
module.exports = {
    settingProjectPath: 'global',
    activeProjectName: '',
    taskList: {},
    newProjectLock: false,
    watcherList: watcherLists
};

/**
 * 新增项目（状态机中新增，实际文件增加在 createTask 函数中执行）
 * @param projectPath
 * @param callback
 */
module.exports.insertProject = (projectPath, callback)=> {
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
            callback({storage, projectPath});
        }
    }
};

/**
 * 创建新项目（实际文件操作）
 * @param projectName
 */
module.exports.createTask = (projectName)=> {
    createTask(projectName);
};

/**
 * 删除选中的项目
 * @param delProjectPath
 * @param callback
 */
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

/**
 * 启动选中的项目进行编译
 * @param workspace
 * @param port
 * @param config
 * @param cb
 */
module.exports.startServer = (workspace, port, config, cb)=> {
    let ip = serverTask.serverStart(workspace, port);
    watcherLists[path.basename(workspace)] = devTask(workspace, config);
    cb(ip);
};

/**
 * 编译选中的项目
 * @param workspace
 * @param config
 */
module.exports.startBuild = (workspace, config)=> {
    buildTask(workspace, config);
};

/**
 * 停止开发模式
 * @param name
 */
module.exports.stopServer = (name)=> {
    watcherLists[name].forEach((v)=> {
        v.close();
    });
    delete watcherLists[name];
    if (isEmpty(watcherLists)) {
        serverTask.serverStop();
    }
};

// 本地保存的数据结构
// fdFlow = {
//     "workspace": "/Users/fuhuixiang/fdFlow_workspace",
//     "projects": {
//         "welcome_example": {
//             "path": "/Users/fuhuixiang/fdFlow_workspace/welcome_example"
//         },
//         "welcome_example2": {
//             "path": "/Users/fuhuixiang/fdFlow_workspace/welcome_example"
//         }
//     }
// };
