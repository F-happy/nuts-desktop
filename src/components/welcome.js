/**
 * 欢迎页面
 * Created by fuhuixiang on 16-10-10.
 */
"use strict";
const Vue = require('vue');

module.exports = Vue.extend({
    template: `<article class="welcome">
                    <img src="assets/img/fd.png" class="welcome-img"/>
                    <h2 class="welcome-title">fdFlow</h2>
                    <h4 class="welcome-text">没伞的孩子要努力跑......</h4>
                    <button class="welcome-example" @click="addExample">导入示例项目</button>
               </article>`,
    methods: {
        addExample: ()=> {
            console.log('say');
            // let workspace = path.join(remote.app.getPath(controller.defaultPath), controller.workspace);
            // openProject(path.join(workspace, 'welcome_example'), (projectName)=> {
            //     // createTask(projectName);
            //     console.log(projectName);
            // });
        }
    }
});
