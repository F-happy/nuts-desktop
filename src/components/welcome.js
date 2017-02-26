/**
 * 欢迎页面
 * Created by fuhuixiang on 16-10-10.
 */
"use strict";
const path = require('path');
const actions = require('../actions');
const controller = require('../controller');

module.exports = Vue.extend({
    template: `<article class="welcome">
                    <img src="assets/img/fd.png" class="welcome-img"/>
                    <h2 class="welcome-title">fdFlow</h2>
                    <h4 class="welcome-text">没伞的孩子要努力跑......</h4>
                    <button class="welcome-example" @click="addExample">导入示例项目</button>
               </article>`,
    methods: {
        addExample() {
            let workspace = path.join(controller.getPath(controller.defaultPath), controller.workspace);
            controller.insertProject(path.join(workspace, 'welcome_example'), (projects)=> {
                let {storage, projectPath} = projects;
                controller.sendMessage('nuts-create', {projectPath: projectPath}, ()=>{
                    actions({type: 'createView', taskList: storage.projects});
                });
            });
        }
    }
});
