/**
 * Created by fuhuixiang on 2017-2-25.
 */
"use strict";

// 全局状态机
const store = {
    settingProjectPath: 'global',
    activeProjectName: '',
    taskList: {},
    newProjectLock: false,
    workspace: '',
    shouldShowWelcome: true,
    active: 0,
    running: false,
    showSettingView: false,
    addNewProject: false,
    dev: {
        // key: {ip: null, port:null}
    }
};

module.exports.getStore = (key = null)=> {
    if (store.hasOwnProperty(key)) {
        return store[key]
    } else {
        return store;
    }
};

module.exports.setStore = (key, value)=> {
    store[key] = value;
};

module.exports.globalStore = store;
