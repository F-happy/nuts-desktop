/**
 * Created by fuhuixiang on 16-8-26.
 */
"use strict";
const path    = require('path'),
      webpack = require('webpack');

const {ipcRenderer, shell, remote} = require('electron');

// 全局状态机
let globalState = {
    settingProjectPath: 'global',
    activeProjectName: '',
    taskList: {},
    newProjectLock: false,
    workspace: ''
};

class Controller {
    constructor() {
        this.name = 'fdFlow';
        this.root = path.join(__dirname, '../');
        this.workspace = `${this.name}_workspace`;
        this.platform = process.platform;
        this.defaultPath = this.platform === 'win32' ? 'desktop' : 'home';
    }

    getPath(path) {
        return remote.app.getPath(path)
    }

    getStorage() {
        let storage = window.localStorage;

        if (storage.getItem(this.name)) {
            return JSON.parse(storage.getItem(this.name));
        } else {
            return false;
        }
    }

    setStorage(storage) {
        localStorage.setItem(this.name, JSON.stringify(storage));
    }

    resetStorage() {
        let storage = localStorage.getItem(this.name);
        if (storage) {
            storage.removeItem(this.name);
        }
    }

    sendMessage(msg, param, callback) {

        // 这里使用随机数来防止回调监听重复的问题，类似 jsonp 的请求。
        let id = 'build-reply-' + Math.round(100 * Math.random());
        param['from'] = id;
        ipcRenderer.send(msg, param);
        ipcRenderer.once(id, function (event, data) {
            callback(data);
        });
    }

    /**
     * 新增项目（状态机中新增，实际文件增加在 createTask 函数中执行）
     * @param projectPath
     * @param callback
     */
    insertProject(projectPath, callback) {
        let storage = this.getStorage();
        let projectName = path.basename(projectPath);

        if (storage && storage['workspace']) {
            if (!storage['projects']) {
                storage['projects'] = {};
            }

            if (storage['projects'][projectName]) {
                alert('项目已存在');
            } else {
                storage['projects'][projectName] = {};
                storage['projects'][projectName]['path'] = projectPath;
                this.setStorage(storage);
                callback({storage, projectPath});
            }
        }
    }

    getState(key = null) {
        if (globalState.hasOwnProperty(key)) {
            return globalState[key]
        } else {
            return globalState;
        }
    }

    setState(key, value) {
        globalState[key] = value;
    }

    openFinder(path) {
        // 打开本地文件夹 https://github.com/electron/electron/blob/master/docs-translations/zh-CN/api/shell.md
        shell.showItemInFolder(path);
    }

    openNativeBrowser(url) {
        shell.openExternal(url);
    }

    showMessageBox(options){
        remote.dialog.showMessageBox(options);
    }

    webpackConfig(devType) {
        let _preset = null;
        // 判断当前环境来加载对应的插件
        try {
            _preset = require.resolve('../../babel-preset-es2015');
        } catch (err) {
            _preset = require.resolve('../node_modules/babel-preset-es2015')
        }
        return {
            watch: false,
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        loader: require.resolve('babel-loader'),
                        exclude: require('path').resolve(__dirname, '../node_modules/'),
                        query: {
                            presets: [_preset]
                        }
                    }
                ]
            },
            plugins: (devType == 'dev') ? [] : [new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }), new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),]
        }
    }
}

module.exports = new Controller();
