/**
 * 重命名文件 (开发中。。。暂时未使用)
 * Created by fuhuixiang on 16-10-21.
 */
"use strict";

const Stream = require('stream');
const path = require('path');

module.exports = (obj)=> {

    let stream = new Stream.Transform({objectMode: true});

    function parsePath(paths) {
        var extname = path.extname(paths);
        return {
            dirname: path.dirname(paths),
            basename: path.basename(paths, extname),
            extname: extname
        };
    }

    stream._transform = function (originalFile, unused, callback) {


        var file = originalFile.clone({contents: false});
        var parsedPath = parsePath(file.relative);
        var _path;

        var type = typeof obj;

        if (type === 'string' && obj !== '') {

            _path = obj;

        } else if (type === 'function') {

            obj(parsedPath);
            _path = path.join(parsedPath.dirname, parsedPath.basename + parsedPath.extname);

        } else if (type === 'object' && obj !== undefined && obj !== null) {

            var dirname  = 'dirname' in obj ? obj.dirname : parsedPath.dirname,
                prefix   = obj.prefix || '',
                suffix   = obj.suffix || '',
                basename = 'basename' in obj ? obj.basename : parsedPath.basename,
                extname  = 'extname' in obj ? obj.extname : parsedPath.extname;

            _path = path.join(dirname, prefix + basename + suffix + extname);

        } else {

            callback(new Error('Unsupported renaming parameter type supplied'), undefined);
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
