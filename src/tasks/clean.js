/**
 * 在最后一次的提交代码中自动过滤代码中的中文文件
 * Created by fuhuixiang on 16-8-26.
 */
"use strict";
const fs = require('fs');

module.exports = (projectDir, callback)=> {
    deleteFolderRecursive(projectDir);
    callback(projectDir);
};

function deleteFolderRecursive(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file)=> {
            let curPath = `${path}/${file}`;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
