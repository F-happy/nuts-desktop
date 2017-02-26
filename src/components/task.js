/**
 * 欢迎页面
 * Created by fuhuixiang on 16-10-10.
 */
"use strict";
const store = require('../store');
const actions = require('../actions');
const controller = require('../controller');

module.exports = Vue.extend({
    template: `<section>
                    <header :class="['header-title',{'filter': showSettingView}]">项目</header>
                    <ul class="project-lists">
                        <li class="list input-ing active" v-if="addNewProject">
                            <div class="icon-finder iconfont"></div>
                            <div class="project-info">
                                <h3 class="project-name" @keyup.enter="handleFocus">
                                    <input type="text" class="add-project-input" title="新项目名称" @blur="handleFocus" autofocus="autofocus"/>
                                </h3>
                            </div>
                            <div class="list-info-img"></div>
                        </li>
                        <li :class="['list',
                            {active: active === index},
                            {running: !!dev[key] && active === index},
                            {'filter': showSettingView}]"
                            v-for="(value, key, index) in taskList" @click.stop="activeView(index, key)">
                            <div class="icon-finder iconfont" @click.stop="openProjectFinder(value)"></div>
                            <div class="project-info">
                                <h3 class="project-name">{{key}}</h3>
                                <p class="project-location" v-if="active === index">
                                    {{!!dev[key] ? 'http://' + dev[key].ip + ':' + dev[key].port : value.path}}
                                </p>
                            </div>
                            <div :class="['list-info-img', active === index ? 'icon-xinxi iconfont' : '']" @click="openSetting(value)"></div>
                        </li>
                    </ul>
               </section>`,
    data: ()=> {
        return store.globalStore
    },
    methods: {
        handleFocus(e) {
            Object.assign(this.$data, actions({type: 'handleFocus', inputStr: e.target.value}));
        },
        activeView(num, name) {
            Object.assign(this.$data, actions({type: 'activeView', num: num, name: name}));
        },
        openSetting(value) {
            Object.assign(this.$data, actions({type: 'openSetting', path: value.path}));
        },
        openProjectFinder(value) {
            Object.assign(this.$data, actions({type: 'openProjectFinder', path: value.path}));
        }
    }
});
