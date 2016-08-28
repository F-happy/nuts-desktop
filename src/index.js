/**
 * 项目的入口文件, 在这里进行所有行为的控制
 * Created by fuhuixiang on 16-8-26.
 */
"use strict";
console.log(__dirname);
const electron = require('electron');
const remote = electron.remote;
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const controller = require(`${__dirname}/src/controller`);

// 开始导入命令脚本
const createTask = require(`${__dirname}/src/tasks/create`);
const delTask = require(`${__dirname}/src/tasks/clean`);
const devTask = require(`${__dirname}/src/tasks/dev`);

// 初始化一些基本变量
let workspace = path.join(remote.app.getPath(controller.defaultPath), controller.workspace);
let constConfig = require(path.join(__dirname, 'fdflow.config.json'));

init();

function init() {
    let storage = controller.getStorage();
    if (!storage) {
        // document.querySelector('.welcome').classList.remove('hide');
        console.log('welcome');
        fs.mkdir(workspace, (err)=> {
            if (err) {
                throw new Error(err);
            } else {
                let fdStorage = {};
                fdStorage.workspace = workspace;
                controller.setStorage(fdStorage);
            }
        });
    }

    initData();
    initListener();
}

function initData() {
    let projectList = controller.getStorage().projectlist;
    if (!!projectList) {
        console.log('has');
    }
    console.log(!!projectList);
}

function initListener() {
    let addBtn = document.querySelector('.tool-add');
    let delBtn = document.querySelector('.tool-del');
    let openBtn = document.querySelector('#jsOpenProject');
    let settingBtn = document.querySelector('.tool-setting');


    addBtn.addEventListener('click', ()=> {
        console.log('add');
        createTask('fuhuixiang');
    });

    delBtn.addEventListener('click', ()=> {
        console.log('del');
        delTask(path.join(workspace, 'fuhuixiang'));
    });

    openBtn.onblur = ()=> {
        if (!!openBtn.value) {
            console.log(openBtn.value);
            // debugger
            openProject(openBtn.files.item(0).path);
            openBtn.value = '';
        }
    };

    settingBtn.addEventListener('click', (e)=> {
        console.log('setting');
        devTask(path.join(workspace, 'fuhuixiang'));
    });
}

function openProject(projectPath) {
    let storage = controller.getStorage();
    let projectName = path.basename(projectPath);

    if (storage && storage['workspace']) {
        if (!storage['projects']) {
            storage['projects'] = {};
        }

        if (storage['projects'][projectName]) {
            alert('项目已存在');
        } else {
            storage['projects'][projectName] = {};
            storage['projects'][projectName]['path'] = projectPath;
            controller.setStorage(storage);

            //插入打开的项目
            // insertOpenProject(projectPath);
        }
    }
}
