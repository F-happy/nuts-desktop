/**
 * Created by fuhuixiang on 16-8-27.
 */
"use strict";
const connectPlugin = require('gulp-connect'),
      probe         = require('../util/is_probe'),
      selfIP        = require('../util/get_ip_address');

module.exports = (proName, port)=> {
    probe(port, (bl, _pt) => {
        if (bl) {
            connectPlugin.server({
                root: `${workspace}/${proName}`,
                port: _pt,
                host: selfIP(),
                livereload: true
            });
            return true;
        } else {
            console.log('端口被占用');
            return false;
        }
    });
};
