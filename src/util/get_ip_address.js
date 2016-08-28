/**
 * 返回当前的IP地址和端口号
 * Created by fuhuixiang on 16-8-27.
 */
'use strict';

const interfaces = require('os').networkInterfaces();

module.exports = () => {
    for (let devName in interfaces) {
        for (let i = 0; i < interfaces[devName].length; i++) {
            let alias = interfaces[devName][i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
};
