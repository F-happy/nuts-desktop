
console.log(__dirname);

const _ = require('lodash');
const common = require('./src/common');

init();

function init() {
    let storage = common.getStorage();
    // console.log(initData());
    initData();
    if(!storage){

    } else {

    }
}

function initData() {
    let storage = common.getStorage();
    console.log(storage);
}
