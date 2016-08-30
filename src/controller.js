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

    webpackConfig(type) {
        return {
            watch: false,
            module: {
                loaders: [
                    {
                        test: /\.js$/, loader: 'babel-loader', exclude: '/node_modules/',
                        query: {
                            //presets: [`${__dirname}/es2015`]  //暂时放弃es6的编译,因为 electron 暂时不支持。
                        }
                    }
                ]
            },
            plugins: (type == 'dev') ? [] : [new webpack.optimize.UglifyJsPlugin()]
        }
    }
}

module.exports = new Controller();
