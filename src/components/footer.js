/**
 * 底部各项按钮开关的组件
 * Created by fuhuixiang on 16-10-10.
 */
"use strict";
const path = require('path');
const isEmpty = require(`../util/is_empty_object`);

module.exports = Vue.extend({
    template: `<footer :class="{'filter':filter}">
                    <section class="btn-box" v-if="bottomView">
                        <button :class="{'dev-running': running}" @click="beginDev">{{running?'监听中...':'开发'}}</button>
                        <button :class="{'dev-running': include}" @click="includeBtn">{{include?'导入中...':'导入'}}</button>
                        <button :class="{'dev-running': building}" @click="beginBuild">{{building?'编译中...':'生产编译'}}</button>
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
                            <span :class="['iconfont icon-yunxing', (running || building || include)?'':'state-done']"></span>
                        </div>
                    </section>
                </footer>`,
    props: ['running', 'filter'],
    data: ()=> {
        return {
            bottomView: false,
            include: false,
            building: false
        }
    },
    created: function () {
        this.bottomView = !isEmpty(controller.getState('taskList'));
    },
    methods: {
        openSetting: function () {
            this.$parent.showSettingView = true;
        },
        createProject: function () {
            this.$parent.createProject();
        },
        deleteProject: function () {
            let delProjectPath = controller.getState('taskList')[controller.getState('activeProjectName')]['path'];
            controller.sendMessage('nuts-delete', {delPath: delProjectPath}, ()=> {
                let storage = controller.getStorage();
                let storageProject = storage.projects;
                for (let i in storageProject) {
                    if (i === path.basename(delProjectPath)) {
                        delete storage.projects[i];
                    }
                }
                controller.setStorage(storage);
                this.$parent.initView(storage.projects);
            });
        },
        beginDev: function () {
            let {taskList, activeProjectName} = controller.getState();
            let workspace = taskList[activeProjectName].path, config = {}, devObj = this.$parent.dev;
            if (!this.running) {
                try {
                    config = require(`${workspace}/fdflow.config.json`);
                } catch (e) {
                    alert('该项目下缺失配置文件！！！');
                    return null;
                }
                config.serverPort += Object.keys(taskList).indexOf(activeProjectName);
                controller.sendMessage('nuts-start-server',
                    {workspace: workspace, port: config.serverPort, config: config}, (ip)=> {
                        this.$parent.running = true;
                        this.$parent.$set(devObj, activeProjectName, {port: config.serverPort, ip: ip});
                        controller.openNativeBrowser(`http://${ip}:${config.serverPort}`);
                    });
            } else {
                controller.sendMessage('nuts-stop-server', {name: activeProjectName}, ()=> {
                    this.$parent.running = false;
                    this.$parent.$delete(devObj, activeProjectName);
                });
            }
        },
        beginBuild: function () {
            let {taskList, activeProjectName} = controller.getState();
            let workspace = taskList[activeProjectName].path, config = {};
            try {
                config = require(`${workspace}/fdflow.config.json`);
            } catch (e) {
                alert('该项目下缺失配置文件！！！');
                return null;
            }
            this.building = true;
            controller.sendMessage('nuts-build', {workspace: workspace, config: config}, ()=> {
                let timeId = setTimeout(()=> {
                    this.building = false;
                    clearTimeout(timeId);
                }, 1500);
            });
        },
        insertProject: function (e) {
            let finder = e.target.files.item(0).path;
            controller.insertProject(finder, (data)=> {
                this.$parent.initView(data.storage.projects);
            });
        },
        includeBtn: function () {
            let {taskList, activeProjectName} = controller.getState();
            this.include = true;
            controller.sendMessage('nuts-include',
                {workspace: taskList[activeProjectName].path}, ()=> {
                    let timeId = setTimeout(()=> {
                        this.include = false;
                        clearTimeout(timeId);
                    }, 1500);
                });
        }
    }
});
