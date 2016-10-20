/**
 * Created by fuhuixiang on 16-8-26.
 */
"use strict";
const path    = require('path'),
      webpack = require('webpack'),
      fs      = require('fs');

class Controller {
    constructor() {
        this.name = 'fdFlow';
        this.root = path.join(__dirname, '../');
        this.exampleName = 'fdFlow_example';
        this.workspace = `${this.name}_workspace`;
        this.platform = process.platform;
        this.defaultPath = this.platform === 'win32' ? 'desktop' : 'home';
    }

    getName() {
        console.log(this.defaultPath);
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
