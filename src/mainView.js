/**
 * Created by fuhuixiang on 16-10-9.
 */
"use strict";

const path = require('path');
const Vue = require('vue');
// const Vue = require('vue/dist/vue.min');
const fs = require('fs');

const controller = require(`${__dirname}/src/controller`);
const isEmpty = require(`${__dirname}/src/util/is_empty_object`);

let workspace = path.join(controller.getPath(controller.defaultPath), controller.workspace);
controller.setState('workspace', workspace);

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

// 这里将主页面的 vue 对象暴露到 window 全局中，方便 Menu 组件调用。
window.mainVue = new Vue({
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
            controller.setState('activeProjectName', name);
            this.running = !!this.dev[name];
        },
        openProjectFinder: function (value) {
            controller.openFinder(value.path);
        },
        openSetting: function (value) {
            if (!!value['path']) {
                controller.setState('settingProjectPath', value['path']);
            }
            this.showSettingView = true;
        },
        initView: function (newStorage) {
            controller.setState('activeProjectName', Object.keys(newStorage).pop());
            controller.setState('taskList', newStorage);
            this.taskList = newStorage;
            this.shouldShowWelcome = isEmpty(newStorage);
            this.active = Object.keys(newStorage).length - 1;
        },
        createProject: function () {
            this.addNewProject = true;
            this.active = -1;
            controller.setState('newProjectLock', true);
        },
        handleFocus: function (e) {
            if (controller.getState('newProjectLock')) {
                controller.setState('newProjectLock', false);
                let inputStr = e.target.value;
                if (inputStr) {
                    let workspace = path.join(controller.getPath(controller.defaultPath), controller.workspace);
                    controller.insertProject(path.join(workspace, inputStr), (projects)=> {
                        let {storage, projectPath} = projects;
                        controller.sendMessage('nuts-create', {projectPath: projectPath}, ()=> {
                            this.initView(storage.projects);
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
                this.addNewProject = false;
                this.active = 0;
            }
        }
    },
    created: function () {
        this.taskList = controller.getStorage().projects;
        controller.setState('taskList', this.taskList);
        controller.setState('activeProjectName', Object.keys(this.taskList)[0]);
        this.shouldShowWelcome = isEmpty(this.taskList);
    }
});
