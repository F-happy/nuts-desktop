/**
 * 格式化时间 格式化时间为yy-mm-dd
 * Created by fuhuixiang on 16-8-26.
 */
'use strict';

module.exports = () => {
    let date = new Date();
    return date.getFullYear() +
        "-" + (date.getMonth() < 10 ? '0' +
        (date.getMonth() + 1) : (date.getMonth() + 1)) +
        "-" + (date.getDate() < 10 ? '0' +
        date.getDate() : date.getDate());
};
