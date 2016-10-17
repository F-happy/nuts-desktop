/**
 * 设置页面
 * Created by fuhuixiang on 16-10-17.
 */
"use strict";
const Vue = require('vue');
const store = require(`../store`);

module.exports = Vue.extend({
    template: `<article class="setting-view">
            <header class="setting-btn-top">
                <i class="iconfont icon-bangzhu"></i>
                <i class="iconfont icon-guanbi" @click="handleClose"></i>
            </header>
            <h2 class="setting-title">工作区路径</h2>
            <div class="setting-workspace">
                <input type="text" id="settingWorkspace" title="工作区路径" :value="defaultWorkSpace"/>
            </div>
            <h2 class="setting-title">功能</h2>
            <ul class="setting-list">
                <li>
                    <span class="iconfont icon-xuanze" @click="hasCDNHandle"></span>
                    <span class="list-text">编译时是否需要添加 CDN</span>
                </li>
                <li>
                    <span class="iconfont icon-xuanze" @click="hasCDNHandle"></span>
                    <span class="list-text">开启 LiveReload 开发模式自动刷新</span>
                </li>
            </ul>
            <h2 class="setting-title">默认设置</h2>
            <ul class="setting-list">
                <li>
                    <div class="list-input-box setting-input">
                        <input type="text" :value="defaultAuthor">
                    </div>
                    <span class="label">项目作者</span>
                </li>
                <li>
                    <div class="list-input-box setting-input">
                        <input type="text" :value="defaultCDNPath">
                    </div>
                    <span class="label">默认的CDN路径</span>
                </li>
                <li>
                    <div class="list-input-box setting-input">
                        <input type="text" :value="defaultReplaceStr">
                    </div>
                    <span class="label">代码中的占位符为 @@replace</span>
                </li>
                <li>
                    <div class="list-input-box">
                        <input type="text" :value="defaultSassLib">
                    </div>
                    <span class="label last-label">引入的 sass 库,默认采用了 nuts-scss 库,使用时需要先安装。传入的值需要是一个数组。</span>
                </li>
            </ul>
        </article>`,
    data: ()=> {
        return {
            defaultWorkSpace: '/Users/fuhuixiang/fdFlow_workspace/welcome_example',
            defaultAuthor: 'jonnyf',
            defaultCDNPath: 'http://cdn.jonnyf.com/image',
            defaultReplaceStr: 666,
            defaultSassLib: 'nuts-scss',
        }
    },
    created: function () {
        // debugger
    },
    methods: {
        hasCDNHandle: function () {
            console.log('cdn');
        },
        handleClose: function () {
            this.$parent.showSettingView = false;
        }
        // inputName: function () {
        //     dialog.showMessageBox({
        //         type: 'info',
        //         title: '提示',
        //         message: "请输入项目名",
        //         buttons: ['确定']
        //     });
        // }
    }
});
