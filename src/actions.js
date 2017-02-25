/**
 * Created by fuhuixiang on 2017-2-25.
 */
"use strict";
const path = require('path');
const store = require(`${__dirname}/src/store`);
const controller = require(`${__dirname}/src/controller`);
const isEmpty = require(`${__dirname}/src/util/is_empty_object`);

function mainApp(action, oldStore = store.globalStore) => {
    switch (action.type) {
        case 'activeView':
            let {num, name} = action;
            return Object.assign({}, oldStore, {
                activeProjectName: name,
                active: num,
                running: !!oldStore.dev[name]
            });
            break;
        case 'openProjectFinder':
            controller.openFinder(action.path);
            return oldStore;
            break;
        case 'openSetting':
            return Object.assign({}, oldStore, {
                showSettingView: true,
                settingProjectPath: !!action['path'] ? action.path : oldStore.settingProjectPath
            });
            break;
        case 'initView':
            let {newStorage} = action;
            return Object.assign({}, oldStore, {
                activeProjectName: Object.keys(newStorage).pop(),
                taskList: newStorage,
                shouldShowWelcome: isEmpty(newStorage),
                active: Object.keys(newStorage).length - 1
            });
            break;
        case 'createProject':
            return Object.assign({}, oldStore, {
                addNewProject: true,
                newProjectLock: true,
                active: -1
            });
            break;
        case 'handleFocus':
            let {inputStr} = action;
            let newStore = {};
            if (oldStore.newProjectLock) {
                newStore = {
                    newProjectLock: false,
                    addNewProject: false,
                    active: 0
                };
                if (inputStr) {
                    let workspace = path.join(controller.getPath(controller.defaultPath), controller.workspace);
                    controller.insertProject(path.join(workspace, inputStr), (projects) => {
                        let {storage, projectPath} = projects;
                        controller.sendMessage('nuts-create', {projectPath: projectPath}, () => {
                            mainApp(store.globalStore, {
                                type: 'initView',
                                newStorage: storage.projects
                            });
                        });
                    });
                } else {
                    controller.showMessageBox({
                        type: 'warning',
                        title: 'fdFlow',
                        message: '警告!',
                        detail: '项目名字不能为空!!!',
                        buttons: ['确定']
                    });
                }
            }
            return Object.assign({}, oldStore, ...newStore);
            break;
        case 'createView':
            let {taskList} = action;
            let initList = Object.keys(taskList);
            return Object.assign({}, oldStore, {
                taskList: taskList,
                shouldShowWelcome: isEmpty(taskList),
                activeProjectName: initList !== 0 ? initList[0] : oldStore.activeProjectName
            });
            break;
        default:
            return oldStore;
            break;
    }
}

module.exports = mainApp;
