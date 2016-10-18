/**
 * 格式化时间 格式化时间为yy-mm-dd
 * Created by fuhuixiang on 16-8-26.
 */
'use strict';

module.exports = () => {
    let date  = new Date(),
        month = date.getMonth() + 1,
        day   = date.getDate() + 1;
    return `${date.getFullYear()}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
};
