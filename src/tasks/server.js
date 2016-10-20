/**
 * Created by fuhuixiang on 16-8-27.
 */
"use strict";
const connectPlugin = require('gulp-connect'),
      selfIP        = require('../util/get_ip_address');

class Server {
    constructor() {
        this.connectCache = {};
    }

    serverStart(workspace, port, livereload = true) {
        this.connectCache[port] = connectPlugin.server({
            root: `${workspace}/fd_dev/`,
            port: port,
            host: selfIP(),
            livereload: livereload
        });
    }

    serverStop(ip, port) {
        try {
            // connectPlugin.server({port: port, host: ip});
            connectPlugin.serverClose();
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    getConnectCache() {
        console.log(this.connectCache);
    }
}

module.exports = new Server();
