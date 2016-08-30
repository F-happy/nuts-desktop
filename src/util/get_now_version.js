/**
 * 获得当前部署的项目的最新版本
 * Created by fuhuixiang on 16-8-28.
 */
const fs = require('fs');

module.exports = (dir, callBack) => {

    let inputDir     = `${dir}/fd_dist`,
        _baseVersion = '';

    getBaseVersion(inputDir, (baseVersion) => {
        _baseVersion = baseVersion;
        existDir(`${inputDir}/static/${baseVersion.join('.')}`);
    });

    /**
     * 判断并生成最新的版本目录
     * @param getDir
     */
    function existDir(getDir) {
        fs.exists(`${getDir}/`, (exists) => {
            if (exists) {
                existDir(`${dir}/fd_dist/static/${getVersion()}`);
            } else {
                callBack(_baseVersion.join('.'));
            }
        });
    }

    /**
     * 判断当前最新的版本目录
     * @returns {string}
     */
    function getVersion() {
        if (_baseVersion[2] > 8) {
            _baseVersion[2] = 0;
            _baseVersion[1]++;
            if (_baseVersion[1] > 8) {
                _baseVersion[1] = 0;
                _baseVersion[0]++;
            }
        } else {
            _baseVersion[2]++;
        }
        return _baseVersion.join('.');
    }

    /**
     * 判断部署次数，并进行初始化目录
     * @param dir
     * @param _callBack
     */
    function getBaseVersion(dir, _callBack) {
        fs.readdir(`${dir}/static/`, (err, files) => {
            let dirList = [],
                baseVersion;
            if (err) {
                console.log('第一次部署中...');
                fs.mkdir(`${dir}/static/`, () => {
                    _callBack([1, 0, 0]);
                });
            } else {
                if (files.length == 0) {
                    files = ['1.0.0'];
                }
                console.log('部署目标已存在，正在更新中...');
                files.forEach((v)=> {
                    let intV = v.replace(/\./g, '');
                    if (!!parseInt(intV)) {
                        dirList.push(intV);
                    }
                });
                baseVersion = Math.max.apply(null, dirList).toString().split('');
                _callBack(baseVersion);
            }
        });
    }
};
