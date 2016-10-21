/**
 * Created by fuhuixiang on 16-10-9.
 */
"use strict";

const electron = require('electron');
const remote = electron.remote;
const path = require('path');
const Vue = require('vue');
const fs = require('fs');

const controller = require(`${__dirname}/src/controller`);
const isEmpty = require(`${__dirname}/src/util/is_empty_object`);
const store = require(`${__dirname}/src/store`);

let workspace = path.join(remote.app.getPath(controller.defaultPath), controller.workspace);

// 初始化软件
if (!controller.getStorage()) {
    console.log('welcome');
    fs.exists(workspace, (exists)=> {
        if (!exists) {
            fs.mkdir(workspace, (err)=> {
                if (err) {
                    throw new Error(err);
                } else {
                    let fdStorage = {};
                    fdStorage.workspace = workspace;
                    controller.setStorage(fdStorage);
                }
            });
        }
    });
}

// 初始化整个页面
Vue.config.devtools = false;

new Vue({
    el: '#app',
    data: {
        shouldShowWelcome: true,
        active: 0,
        taskList: {},
        running: false,
        showSettingView: false,
        addNewProject: false,
        dev: {
            // key: {ip: null, port:null}
        }
    },
    components: {
        // <nuts-component> 只能用在父组件模板内
        'nuts-welcome': require(`${__dirname}/src/components/welcome`),
        'nuts-footer': require(`${__dirname}/src/components/footer`),
        'nuts-setting': require(`${__dirname}/src/components/setting`)
    },
    methods: {
        activeView: function (num, name) {
            this.active = num;
            store.activeProjectName = name;
            this.running = !!this.dev[name];
        },
        openProjectFinder: function (value) {
            // 打开本地文件夹 https://github.com/electron/electron/blob/master/docs-translations/zh-CN/api/shell.md
            electron.shell.showItemInFolder(value.path);
        },
        openSetting: function (value) {
            if (!!value['path']) {
                store.settingProjectPath = value['path'];
            }
            this.showSettingView = true;
        },
        initView: function (newStorage) {
            store.activeProjectName = Object.keys(newStorage).pop();
            this.taskList = store.taskList = newStorage;
            this.shouldShowWelcome = isEmpty(newStorage);
            this.active--;
        },
        createProject: function () {
            this.addNewProject = true;
            this.active = -1;
            store.newProjectLock = true;
        },
        handleFocus: function (e) {
            if (store.newProjectLock) {
                store.newProjectLock = false;
                let inputStr = e.target.value;
                if (inputStr) {
                    let workspace = path.join(remote.app.getPath(controller.defaultPath), controller.workspace);
                    store.insertProject(path.join(workspace, inputStr), (projects)=> {
                        let {storage, projectPath} = projects;
                        store.createTask(projectPath);
                        this.initView(storage.projects);
                    });
                } else {
                    remote.dialog.showMessageBox({
                        type: 'warning',
                        title: 'fdFlow',
                        message: '警告!',
                        detail: '项目名字不能为空!!!',
                        buttons: ['确定']
                    });
                }
                this.addNewProject = false;
                this.active = 0;
            }
        }
    },
    created: function () {
        this.taskList = store.taskList = controller.getStorage().projects;
        store.activeProjectName = Object.keys(this.taskList)[0];
        this.shouldShowWelcome = isEmpty(this.taskList);
    }
});
