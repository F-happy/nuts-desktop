/**
 * 重命名文件
 * Created by fuhuixiang on 16-10-21.
 */
"use strict";

const streamPack = require('stream');
const path = require('path');

module.exports = (obj)=> {

    let stream = new streamPack.Transform({objectMode: true});

    stream._transform = function (originalFile, unused, callback) {


        let file = originalFile.clone({contents: false});
        let _path;

        if (typeof obj === 'string' && obj !== '') {
            _path = obj;
        } else if (typeof obj === 'function') {
            obj(path.extname(paths));
            _path = path.join(path.extname(paths).dirname, path.extname(paths).basename + path.extname(paths).extname);
        } else if (typeof obj === 'object' && obj !== undefined && obj !== null) {
            let dirname  = 'dirname' in obj ? obj.dirname : path.extname(paths).dirname,
                basename = 'basename' in obj ? obj.basename : path.extname(paths).basename,
                extname  = 'extname' in obj ? obj.extname : path.extname(paths).extname,
                suffix   = obj.suffix || '',
                prefix   = obj.prefix || '';

            _path = path.join(dirname, prefix + basename + suffix + extname);

        } else {
            callback(new Error('type supplied'), undefined);
            return;
        }

        file.path = path.join(file.base, _path);

        // Rename sourcemap if present
        if (file.sourceMap) {
            file.sourceMap.file = file.relative;
        }

        callback(null, file);
    };

    return stream;
};
