/**
 * 欢迎页面
 * Created by fuhuixiang on 16-10-10.
 */
"use strict";

module.exports = Vue.extend({
    template: `<li :class="['list',
                    {active: active === index},
                    {running: !!dev[key] && active === index},
                    {'filter':showSettingView}]"
                    v-for="(value, key, index) in taskList" @click.stop="activeView(index, key)">
                    <div class="icon-finder iconfont" @click.stop="openProjectFinder(value)"></div>
                    <div class="project-info">
                        <h3 class="project-name">{{key}}</h3>
                        <p class="project-location" v-if="active === index">
                            {{!!dev[key]? 'http://'+dev[key].ip+':'+dev[key].port : value.path}}
                        </p>
                    </div>
                    <div :class="['list-info-img', active === index ? 'icon-xinxi iconfont' : '']" @click="openSetting(value)"></div>
                </li>`,
    methods: {
    }
});
