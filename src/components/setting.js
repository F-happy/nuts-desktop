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
                <input type="text" title="工作区路径" :value="defaultWorkSpace" disabled="disabledWorkSpace"/>
            </div>
            <h2 class="setting-title">功能</h2>
            <ul class="setting-list">
                <li>
                    <span :class="['iconfont', 'icon-xuanze', needCDN ? 'setting-active':'']" @click="handleChange('cdn')"></span>
                    <span class="list-text">编译时是否需要添加 CDN</span>
                </li>
                <li>
                    <span :class="['iconfont', 'icon-xuanze', openLiveReload ? 'setting-active':'']" @click="handleChange('live')"></span>
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
    data: function () {
        let settingPath = store.settingProjectPath,
            config      = {};
        try {
            if (settingPath === 'global') {
                config = require(`${process.cwd()}/fdflow.config.json`);
            } else {
                config = require(`${settingPath}/fdflow.config.json`);
            }
        } catch (e) {
            alert('配置文件不存在！！!');
            this.$parent.showSettingView = false;
        }
        return {
            disabledWorkSpace: settingPath === 'global',
            defaultWorkSpace: settingPath === 'global' ? '全局配置文件' : settingPath,
            defaultAuthor: config.author || '',
            defaultCDNPath: config.staticURL || '',
            defaultReplaceStr: config.replaceStr || '',
            defaultSassLib: (config.sassLib || []).join(','),
            openLiveReload: true,
            needCDN: config.needCDN || false,
        }
    },
    methods: {
        handleChange: function (type) {
            switch (type) {
                case 'cdn':
                    this.needCDN = !this.needCDN;
                    break;
                case 'live':
                    this.openLiveReload = !this.openLiveReload;
                    break;
                default:
                    break;
            }
        },
        handleClose: function () {
            this.$parent.showSettingView = false;
        }
    }
});
