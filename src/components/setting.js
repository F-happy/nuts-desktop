/**
 * 设置页面
 * Created by fuhuixiang on 16-10-17.
 */
"use strict";
const Vue = require('vue');
const jsonTool = require('node-json-file');
const controller = require('../controller');

let config = {};

module.exports = Vue.extend({
    template: `<article class="setting-view">
            <header class="setting-btn-top">
                <i class="iconfont icon-bangzhu"></i>
                <i class="iconfont icon-guanbi" @click="handleClose"></i>
            </header>
            <h2 class="setting-title">工作区路径</h2>
            <div class="setting-workspace">
                <input type="text" title="工作区路径" :value="defaultWorkSpace" disabled="false"/>
            </div>
            <h2 class="setting-title">功能</h2>
            <ul class="setting-list">
                <li>
                    <span :class="['iconfont icon-xuanze', needCDN ? 'setting-active':'']" 
                        @click="handleChange($event, 'cdn')"></span>
                    <span>编译时是否需要添加 CDN</span>
                </li>
                <li>
                    <span :class="['iconfont icon-xuanze', openLiveReload ? 'setting-active':'']" 
                        @click="handleChange($event, 'live')"></span>
                    <span>开启 LiveReload 开发模式自动刷新</span>
                </li>
            </ul>
            <h2 class="setting-title">默认设置</h2>
            <ul class="setting-list">
                <li>
                    <div class="list-input-box">
                        <input type="text" :value="defaultAuthor" @blur="handleChange($event, 'name')">
                    </div>
                    <span class="label">项目作者</span>
                </li>
                <li>
                    <div class="list-input-box">
                        <input type="text" :value="defaultCDNPath" @blur="handleChange($event, 'path')">
                    </div>
                    <span class="label">默认的CDN路径</span>
                </li>
                <li>
                    <div class="list-input-box">
                        <input type="text" :value="defaultReplaceStr" @blur="handleChange($event, 'replace')">
                    </div>
                    <span class="label">代码中的占位符为 @@replace</span>
                </li>
                <li>
                    <div class="list-input-box">
                        <input type="text" :value="defaultSassLib" @blur="handleChange($event, 'sass')">
                    </div>
                    <span class="label last-label">引入的 sass 库,默认采用了 nuts-scss 库,使用时需要先安装。传入的值需要是一个数组。</span>
                </li>
            </ul>
        </article>`,
    data: function () {
        let settingPath       = controller.getState('settingProjectPath'),
            defaultAuthor     = '',
            defaultCDNPath    = '',
            defaultReplaceStr = '',
            defaultSassLib    = [],
            needCDN           = '';
        try {
            if (settingPath === 'global') {
                config = jsonTool(`${process.cwd()}/fdflow.config.json`);
            } else {
                config = jsonTool(`${settingPath}/fdflow.config.json`);
            }
            defaultAuthor = config.select('author');
            defaultCDNPath = config.select('staticURL');
            defaultReplaceStr = config.select('replaceStr');
            defaultSassLib = config.select('sassLib');
            needCDN = config.select('needCDN');
        } catch (e) {
            this.$parent.showSettingView = false;
            alert('配置文件不存在！！!');
        }
        return {
            defaultWorkSpace: settingPath === 'global' ? '全局配置文件' : settingPath,
            defaultAuthor: defaultAuthor,
            defaultCDNPath: defaultCDNPath,
            defaultReplaceStr: defaultReplaceStr,
            defaultSassLib: defaultSassLib.join(','),
            openLiveReload: true,
            needCDN: needCDN,
            shouldSave: false
        }
    },
    methods: {
        handleChange: function (e, type) {
            let value = e.target.value;
            switch (type) {
                case 'cdn':
                    this.needCDN = !this.needCDN;
                    config.update('needCDN', !this.needCDN);
                    break;
                case 'live':
                    this.openLiveReload = !this.openLiveReload;
                    break;
                case 'name':
                    if (value !== this.defaultAuthor) {
                        config.update('author', value);
                        this.shouldSave = true;
                    }
                    break;
                case 'path':
                    if (value !== this.defaultCDNPath) {
                        config.update('staticURL', value);
                        this.shouldSave = true;
                    }
                    break;
                case 'replace':
                    if (value !== this.defaultReplaceStr) {
                        config.update('replaceStr', value);
                        this.shouldSave = true;
                    }
                    break;
                case 'sass':
                    if (value !== this.defaultSassLib) {
                        config.update('sassLib', value.split(','));
                        this.shouldSave = true;
                    }
                    break;
                default:
                    break;
            }
        },
        handleClose: function () {
            if (this.shouldSave) {
                config.save();
            }
            this.$parent.showSettingView = false;
        }
    }
});
