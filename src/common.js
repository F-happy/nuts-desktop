/**
 * Created by fuhuixiang on 16-8-26.
 */
"use strict";
const path = require('path'),
      fs   = require('fs');

class Common {
    constructor() {
        this.name = 'fdFlow';
        this.root = path.join(__dirname, '../');
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
}

module.exports = new Common();
