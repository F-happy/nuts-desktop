/**
 * 项目的入口文件, 在这里进行所有行为的控制
 * Created by fuhuixiang on 16-8-26.
 */
"use strict";
const $ = require('jquery');
const electron = require('electron');
const remote = electron.remote;
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const controller = require(`${__dirname}/src/controller`);

// 开始导入命令脚本
const createTask = require(`${__dirname}/src/tasks/create`),
      delTask    = require(`${__dirname}/src/tasks/clean`),
      devTask    = require(`${__dirname}/src/tasks/dev`),
      serverTask = require(`${__dirname}/src/tasks/server`),
      buildTask  = require(`${__dirname}/src/tasks/build`);

// 初始化一些基本变量
let workspace   = path.join(remote.app.getPath(controller.defaultPath), controller.workspace),
    constConfig = require(path.join(__dirname, 'fdflow.config.json')),
    portCache   = [],
    defaultPort = 23332;

// 声明需要操作的 DOM 节点
let $welcome    = $('.welcome'),
    $header     = $('.header-title'),
    $btnBox     = $('.btn-box'),
    addBtn      = $('.tool-add'),
    delBtn      = $('.tool-del'),
    openBtn     = $('#jsOpenProject'),
    settingBtn  = $('.tool-setting'),
    projectList = $('.project-lists'),
    devBtn      = $('.dev-btn'),
    buildBtn    = $('.build-btn');

init();

function init() {
    let storage = controller.getStorage();
    if (!storage) {
        console.log('welcome');
        fs.exists(workspace, (exists)=> {
            if (!exists) {
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
        });
    }

    initData();
    initListener();
}

function initData() {
    let projectList = controller.getStorage().projects;

    // 判断是否当前工作目录下有项目,如果有的话则显示。
    if (!!projectList && !_.isEmpty(projectList)) {
        $welcome.addClass('hide');
        $header.removeClass('hide');
        $btnBox.removeClass('hide');
        insertOpenProject(projectList);
    } else {
        $('.welcome-example').one('click', ()=> {
            openProject(path.join(workspace, 'welcome_example'), (projectName)=> {
                createTask(projectName);
            });
        });
    }
}

function initListener() {
    addBtn.click(()=> {
        newProject();
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
    });

    projectList.find('.list').click(function (e) {
        $(this).siblings().removeClass('active')
            .find('.list-info-img').removeClass('iconfont icon-xinxi').end()
            .find('.project-location').addClass('hide').end().end()
            .addClass('active').find('.list-info-img')
            .addClass('iconfont icon-xinxi').end()
            .find('.project-location').removeClass('hide');
        if ($(this).hasClass('running')) {
            devBtn.addClass('dev-running').text('监听中...');
        } else {
            devBtn.removeClass('dev-running').text('开发');
        }
    });

    $('.icon-finder').click((self)=> {
        electron.shell.showItemInFolder($(self.target).next().children('.project-location').text());
    });

    devBtn.click(()=> {
        runTask();
    });

    buildBtn.click(()=> {
        distTask();
    });
}

function distTask() {
    let activeTag = $('.active');
    if (!_.isEmpty(activeTag)) {
        buildBtn.addClass('dev-running').text('编译中...');
        $('.state-running').addClass('state-done').removeClass('state-running');
        buildTask(activeTag.find('.project-location').text());
        let timeId = setTimeout(()=> {
            buildBtn.removeClass('dev-running').text('生产编译');
            $('.state-done').removeClass('state-done').addClass('state-running');
            clearTimeout(timeId);
        }, 1500);
    }
}

function runTask() {
    // debugger
    let port      = 0,
        activeTag = $('.active');
    if (!activeTag.hasClass('running')) {
        if (portCache.indexOf(defaultPort + 1) == -1) {
            portCache.push(defaultPort + 1);
            port = defaultPort + 1;
        } else {
            port = defaultPort + 2;
        }
        let ip = serverTask.serverStart(activeTag.find('.project-name').text(), port).ip;
        if (!!ip) {
            devTask(activeTag.find('.project-location').text());
            activeTag.addClass('running').find('.project-info').children('.project-location').addClass('hide').end()
                .append(`<p class="project-point">http://${ip}:${port}</p>`).end().data('server', {
                port: port,
                host: ip
            });
            $('.state-running').addClass('state-done').removeClass('state-running');
            devBtn.addClass('dev-running').text('监听中...');
            electron.shell.openExternal(`http://${ip}:${port}`);
        }
    } else {
        let data = activeTag.data('server');
        serverTask.serverStop(data.host, data.port);
        activeTag.removeClass('running').find('.project-info').children('.project-location').removeClass('hide').end()
            .children('.project-point').remove();
        devBtn.removeClass('dev-running').text('开发');
        $('.state-done').removeClass('state-done').addClass('state-running');
    }
}

function newProject() {
    let projectList = $('.project-lists');
    if (!_.isEmpty(projectList.find('.input-ing'))) {
        alert('项目名字不能为空!!!');
        return;
    }
    if (viewIsEmpty()) {
        $welcome.addClass('hide');
        $header.removeClass('hide');
        $btnBox.removeClass('hide');
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
}

function openProject(projectPath, callback = ()=> {
}) {
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
        $welcome.addClass('hide');
        $header.removeClass('hide');
        $btnBox.removeClass('hide');
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
        $welcome.removeClass('hide');
        $header.addClass('hide');
        $btnBox.addClass('hide');
        return true;
    } else {
        $welcome.addClass('hide');
        $header.removeClass('hide');
        $btnBox.removeClass('hide');
        return false;
    }
}
