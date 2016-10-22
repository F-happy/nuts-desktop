/**
 * 底部各项按钮开关的组件
 * Created by fuhuixiang on 16-10-10.
 */
"use strict";
const Vue = require('vue');
const electron = require('electron');
const store = require(`../store`);
const isEmpty = require(`../util/is_empty_object`);

module.exports = Vue.extend({
    template: `<footer>
                    <section class="btn-box" v-if="bottomView">
                        <button :class="['dev-btn', {'dev-running': running}]" @click="beginDev">{{running?'监听中...':'开发'}}</button>
                        <button :class="['build-btn', {'dev-running': building}]" @click="beginBuild">{{building?'编译中...':'生产编译'}}</button>
                    </section>
                    <section class="tools">
                        <div class="tool-btn">
                            <span class="tool-add iconfont icon-jia" @click="createProject"></span>
                            <span class="tool-del iconfont icon-jian" @click="deleteProject"></span>
                            <span class="tool-find iconfont icon-wenjianjia">
                                <input class="input-open" @change="insertProject" lazy type="file" webkitdirectory multiple>
                            </span>
                            <span class="tool-setting iconfont icon-shezhi" @click="openSetting"></span>
                        </div>
                        <div class="tool-state">
                            <span class="state-text"><!--Done--></span>
                            <span :class="['iconfont', 'icon-yunxing', (running || building)?'state-done':'state-running']"></span>
                        </div>
                    </section>
                </footer>`,
    props: ['running'],
    data: ()=> {
        return {
            bottomView: false,
            building: false
        }
    },
    created: function () {
        this.bottomView = !isEmpty(store.taskList);
    },
    methods: {
        openSetting: function () {
            this.$parent.showSettingView = true;
        },
        createProject: function () {
            this.$parent.createProject();
        },
        deleteProject: function () {
            store.deleteProject(store.taskList[store.activeProjectName]['path'], (storage)=> {
                this.$parent.initView(storage.projects);
            });
        },
        beginDev: function () {
            let {taskList, activeProjectName} = store;
            let workspace = taskList[activeProjectName].path, config = {}, devObj = this.$parent.dev;
            if (!this.running) {
                try {
                    config = require(`${workspace}/fdflow.config.json`);
                } catch (e) {
                    alert('该项目下缺失配置文件！！！');
                    return null;
                }
                config.serverPort += Object.keys(taskList).indexOf(activeProjectName);
                store.startServer(workspace, config.serverPort, config, (ip)=> {
                    this.$parent.running = true;
                    this.$parent.$set(devObj, activeProjectName, {port: config.serverPort, ip: ip});
                    electron.shell.openExternal(`http://${ip}:${config.serverPort}`);
                });
            } else {
                this.$parent.running = false;
                this.$parent.$delete(devObj, activeProjectName);
                store.stopServer(activeProjectName);
            }
        },
        beginBuild: function () {
            let {taskList, activeProjectName} = store;
            let workspace = taskList[activeProjectName].path, config = {};
            try {
                config = require(`${workspace}/fdflow.config.json`);
            } catch (e) {
                alert('该项目下缺失配置文件！！！');
                return null;
            }
            this.building = true;
            store.startBuild(workspace, config);
            let timeId = setTimeout(()=> {
                this.building = false;
                clearTimeout(timeId);
            }, 1500);
        },
        insertProject: function (e) {
            let finder = e.target.files.item(0).path;
            store.insertProject(finder, (data)=> {
                this.$parent.initView(data.storage.projects);
            });
        }
    }
});
