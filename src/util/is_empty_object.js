/**
 * 判断object/json 是否为空
 * Created by fuhuixiang on 16-10-19.
 */
"use strict";

module.exports = (obj)=> {
    for (let i in obj) {
        return !1;
    }
    return !0
};
