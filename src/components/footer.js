/**
 * 底部各项按钮开关的组件
 * Created by fuhuixiang on 16-10-10.
 */
"use strict";
const Vue = require('vue');
const store = require(`../store`);
const isEmpty = require(`../util/is_empty_object`);

module.exports = Vue.extend({
    template: `<footer>
                    <section class="btn-box" v-if="bottomView">
                        <button class="dev-btn" @click="beginDev">开发</button>
                        <button class="build-btn" @click="beginBuild">生产编译</button>
                    </section>
                    <section class="tools">
                        <div class="tool-btn">
                            <span class="tool-add iconfont icon-jia" @click="createProject"></span>
                            <span class="tool-del iconfont icon-jian" @click="deleteProject"></span>
                            <span class="tool-find iconfont icon-wenjianjia">
                                <input class="input-open" id="jsOpenProject" type="file" webkitdirectory multiple>
                            </span>
                            <span class="tool-setting iconfont icon-shezhi" @click="openSetting"></span>
                        </div>
                        <div class="tool-state">
                            <span class="state-text"><!--Done--></span>
                            <span class="state-running iconfont icon-yunxing"></span>
                        </div>
                    </section>
                </footer>`,
    props: ['running', 'projects'],
    data: ()=> {
        return {
            bottomView: false
        }
    },
    created: function () {
        this.bottomView = !isEmpty(this.projects);
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
            let workspace = taskList[activeProjectName].path, config = {};
            try {
                config = require(`${workspace}/fdflow.config.json`);
            } catch (e) {
                alert('该项目下缺失配置文件！！！');
                return null;
            }
            config.serverPort += Object.keys(taskList).indexOf(activeProjectName);
            store.startServer(workspace, config.serverPort, config);
        },
        beginBuild: function () {

        }
    }
});
