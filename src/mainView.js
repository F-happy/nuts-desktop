/**
 * Created by fuhuixiang on 16-10-9.
 */
"use strict";

const fs = require('fs');
const path = require('path');

const store = require(`${__dirname}/src/store`);
const actions = require(`${__dirname}/src/actions`);
const controller = require(`${__dirname}/src/controller`);

let workspace = path.join(controller.getPath(controller.defaultPath), controller.workspace);
store.setStore('workspace', workspace);

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
const mainVue = new Vue({
    el: '#app',
    data: store.globalStore,
    components: {
        // <nuts-component> 只能用在父组件模板内
        'nuts-welcome': require(`${__dirname}/src/components/welcome`),
        'nuts-footer': require(`${__dirname}/src/components/footer`),
        'nuts-setting': require(`${__dirname}/src/components/setting`),
        'nuts-task': require(`${__dirname}/src/components/task`)
    },
    methods: {
        // initView: function (newStorage) {
        //     this.$data = actions({type: 'initView', newStorage: newStorage});
        // },
        // createProject: function () {
        //     this.$data = actions({type: 'createProject'});
        // },
    },
    created: function () {
        Object.assign(this.$data, actions({type: 'createView', taskList: controller.getStorage().projects || {}}));
    }
});

// window.mainVue = mainVue;
module.exports = mainVue;
