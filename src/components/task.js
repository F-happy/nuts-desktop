/**
 * 欢迎页面
 * Created by fuhuixiang on 16-10-10.
 */
"use strict";
const controller = require('../controller');

module.exports = Vue.extend({
    template: `<article>
                    <header :class="['header-title',{'filter':showSettingView}]">项目</header>
                    <ul class="project-lists">
                        <task-new v-if="addNewProject"></task-new>
                        <task-list></task-list>
                    </ul>
               </article>`,
    components: {
        'task-new': require('./task_new'),
        'task-list': require('./task_list')
    },
    data: ()=> {
        return {
            addNewProject: false,
        }
    },
    methods: {

    }
});
