/**
 * 项目的入口文件, 在这里进行所有行为的控制
 * Created by fuhuixiang on 16-8-26.
 */
"use strict";
console.log(__dirname);
const $ = require('jquery');
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
    let projectList = controller.getStorage().projects;

    // 判断是否当前工作目录下有项目,如果有的话则显示。
    if (!!projectList && !_.isEmpty(projectList)) {
        console.log('has');
        $('.welcome').addClass('hide');
        $('.header-title').removeClass('hide');
        $('.btn-box').removeClass('hide');
        insertOpenProject(projectList);
    } else {
        $('.welcome-example').one('click', ()=> {
            openProject(path.join(workspace, 'welcome-example'), (projectName)=> {
                createTask(projectName);
            });
        });
    }
    console.log(!!projectList);
}

function initListener() {
    let addBtn = $('.tool-add');
    let delBtn = $('.tool-del');
    let openBtn = $('#jsOpenProject');
    let settingBtn = $('.tool-setting');
    let projectList = $('.project-lists');
    let finderBtn = $('.icon-finder');


    addBtn.click(()=> {
        console.log('add');

        if (!_.isEmpty(projectList.find('.input-ing'))) {
            alert('项目名字不能为空!!!');
            return;
        }
        if (viewIsEmpty()) {
            $('.welcome').addClass('hide');
            $('.header-title').removeClass('hide');
            $('.btn-box').removeClass('hide');
        }
        let inputDom = $(`<li class="list input-ing">
                <div class="icon-finder iconfont"></div>
                <div class="project-info">
                    <h3 class="project-name"><input type="text" class="add-project-input" id="addInput"></h3>
                    <p class="project-location hide"></p>
                </div>
                <div class="list-info-img"></div>
            </li>`);
        projectList.append(inputDom).removeClass('hide');
        let addInput = $('#addInput');
        addInput.focusout(()=> {
            if (!!addInput.val()) {
                openProject(path.join(workspace, addInput.val()), (projectName)=> {
                    createTask(projectName);
                });
            }
            $('.input-ing').remove();
            if (!viewIsEmpty()) {
                initListener();
            }
        });
    });

    delBtn.click(()=> {
        let delDom = $('.active').find('.project-location');
        delProject(delDom.text(), ()=> {
            delDom.end().remove();
            projectList.children(':first').addClass('active')
                .find('.list-info-img').addClass('iconfont icon-xinxi').end()
                .find('.project-location').removeClass('hide');
            viewIsEmpty();
        });
    });

    openBtn.change(()=> {
        if (!!openBtn.val()) {
            console.log(openBtn.val());
            openProject(openBtn.get(0).files.item(0).path);
            openBtn.value = '';
        }
    });

    settingBtn.click(()=> {
        console.log('setting');
        devTask(path.join(workspace, 'fuhuixiang'));
    });

    projectList.find('.list').click(function (e) {
        $(this).siblings().removeClass('active')
            .find('.list-info-img').removeClass('iconfont icon-xinxi').end()
            .find('.project-location').addClass('hide').end().end()
            .addClass('active').find('.list-info-img')
            .addClass('iconfont icon-xinxi').end()
            .find('.project-location').removeClass('hide');
    });

    finderBtn.click((self)=> {
        electron.shell.showItemInFolder($(self.target).next().children('.project-location').text());
    });
}

function openProject(projectPath, callback = ()=>{}) {
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
            insertOpenProject({projectPath: {path: projectPath}});
            callback(projectName);
        }
    }
}

function insertOpenProject(projectList) {
    let projectBox = $('.project-lists');
    let domList = '';

    _.forEach(projectList, (v)=> {
        domList += `<li class="list">
                <div class="icon-finder iconfont"></div>
                <div class="project-info">
                    <h3 class="project-name">${path.basename(v.path)}</h3>
                    <p class="project-location hide">${v.path}</p>
                </div>
                <div class="list-info-img"></div>
            </li>`;
    });
    if (!viewIsEmpty()) {
        projectBox.append(domList);
    } else {
        $('.welcome').addClass('hide');
        $('.header-title').removeClass('hide');
        $('.btn-box').removeClass('hide');
        projectBox.html(domList).removeClass('hide')
            .children('.list:first').addClass('active')
            .find('.list-info-img').addClass('iconfont icon-xinxi').end()
            .find('.project-location').removeClass('hide');
    }
}

function delProject(projectPath, callback) {
    delTask(projectPath, ()=> {
        let storage = controller.getStorage();
        _.forEach(storage.projects, (v, k)=> {
            if (k == path.basename(projectPath)) {
                delete storage.projects[k];
            }
        });
        console.log(storage);
        controller.setStorage(storage);
        if (_.isEmpty(storage.projects)) {
            initData();
        }
        callback();
    });
}

function viewIsEmpty() {
    let projectBox = $('.project-lists');
    if (_.isEmpty(projectBox.children())) {
        $('.welcome').removeClass('hide');
        $('.header-title').addClass('hide');
        $('.btn-box').addClass('hide');
        return true;
    } else {
        $('.welcome').addClass('hide');
        $('.header-title').removeClass('hide');
        $('.btn-box').removeClass('hide');
        return false;
    }
}
