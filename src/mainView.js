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
const isEmpty = require(`${__dirname}/src/util/isEmptyObject`);
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
        },
        openProjectFinder: function (value) {
            // 打开本地文件夹 https://github.com/electron/electron/blob/master/docs-translations/zh-CN/api/shell.md
            electron.shell.showItemInFolder(value.path);
        },
        openSetting: function (name) {
            store.settingProjectName = name;
            this.showSettingView = true;
        },
        initView: function (newStorage) {
            this.taskList = store.taskList = newStorage;
            this.shouldShowWelcome = isEmpty(newStorage);
        }
    },
    created: function () {
        this.taskList = store.taskList = controller.getStorage().projects;
        store.activeProjectName = Object.keys(this.taskList)[0];
        this.shouldShowWelcome = isEmpty(this.taskList);
    }
});
