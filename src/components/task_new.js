/**
 * 欢迎页面
 * Created by fuhuixiang on 16-10-10.
 */
"use strict";

module.exports = Vue.extend({
    template: `<li class="list input-ing active" v-if="addNewProject">
                    <div class="icon-finder iconfont"></div>
                    <div class="project-info">
                        <h3 class="project-name" @keyup.enter="handleFocus">
                            <input type="text" class="add-project-input" title="新项目名称" @blur="handleFocus" autofocus="autofocus"/>
                        </h3>
                    </div>
                    <div class="list-info-img"></div>
                </li>`,
    methods: {
        handleFocus: function (e) {
            window.mainVue.handleFocus(e);
        }
    }
});
