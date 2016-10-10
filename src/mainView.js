/**
 * Created by fuhuixiang on 16-10-9.
 */
"use strict";

const remote = require('electron').remote;
const _ = require('lodash');
const path = require('path');
const Vue = require('vue');
const fs = require('fs');

const controller = require(`${__dirname}/src/controller`);

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
new Vue({
    el: '#app',
    data: {
        shouldShowWelcome: true,
        active: 0,
        taskList: {},
        running: false
    },
    components: {
        // <nuts-component> 只能用在父组件模板内
        'nuts-welcome': require(`${__dirname}/src/components/welcome`),
        'nuts-footer': require(`${__dirname}/src/components/footer`)
    },
    methods: {
        getName: (item)=> {
            return path.basename(item.path)
        },
        activeView: function (num) {
            this.active = num;
            console.log(num)
        },
        openProjectFinder: function () {
            console.log('finder');
        }
    },
    created: function () {
        this.shouldShowWelcome = false;
        this.taskList = controller.getStorage().projects;
    }
});
