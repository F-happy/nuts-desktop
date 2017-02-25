/**
 * Created by fuhuixiang on 16-8-26.
 */
"use strict";
const {remote, shell} = require('electron');
const {Menu, dialog} = remote;
const fetch = require('node-fetch');
// 这个模块将会自动引入 controller 模块，所以可以直接使用 controller 对象。

/**
 * 检查更新
 */
function update() {
    fetch('https://raw.githubusercontent.com/F-happy/nuts-desktop/master/package.json')
        .then((response)=> {
            return response.json();
        }).then((data)=> {
        let oldVer = require(`${__dirname}/package.json`).version.split('-')[0],
            newVer = data.version.split('-')[0].split('.').join(''),
            mes    = '暂无更新！',
            detail = '您当前的版本为最新版';
        oldVer = oldVer.split('-')[0].split('.').join('');

        if (newVer > oldVer) {
            mes = `发现更新！${newVer}`;
            detail = '请到官网下载最新版本！';
        }
        dialog.showMessageBox({
            type: 'info',
            title: 'fdFlow正在检查更新...',
            message: mes,
            detail: detail,
            buttons: ['确定']
        });
    }).catch((ex)=> {
        console.log('parsing failed', ex);
    });
}

let template = [
    {
        label: '文件',
        submenu: [
            {
                label: '新建项目',
                accelerator: 'CmdOrCtrl+N',
                click: function () {
                    window.mainVue.createProject();
                }
            }, {
                label: '打开项目',
                accelerator: 'CmdOrCtrl+O',
                click: function () {
                    let item        = window.mainVue.taskList,
                        projectPath = item[Object.keys(item).pop()].path;
                    if (projectPath) {
                        controller.openFinder(projectPath);
                    }
                }
            }, {
                label: '刷新',
                accelerator: 'CmdOrCtrl+R',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.reload();
                    }
                }
            }
        ]
    }, {
        label: '编辑',
        submenu: [
            {
                label: '撤销',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            }, {
                label: '重做',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
            }, {
                type: 'separator'
            }, {
                label: '剪切',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            }, {
                label: '复制',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            }, {
                label: '粘贴',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            }, {
                label: '全选',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            }
        ]
    }, {
        label: '任务',
        submenu: [
            {
                label: '执行 开发流程',
                accelerator: 'CmdOrCtrl+1',
                click: function () {
                    window.mainVue.$children[0].beginDev();
                }
            }, {
                label: '执行 生产流程',
                accelerator: 'CmdOrCtrl+2',
                click: function () {
                    window.mainVue.$children[0].beginBuild();
                }
            }, {
                label: '执行 导入图片',
                accelerator: 'CmdOrCtrl+3',
                click: function () {
                    window.mainVue.$children[0].includeBtn();
                }
            }
        ]
    },
    {
        label: '窗口',
        role: 'window',
        submenu: [
            {
                label: '最小化',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            }, {
                label: '关闭窗口',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            }, {
                label: '调试模式',
                accelerator: 'Option+CmdOrCtrl+I',
                click: function () {
                    remote.getCurrentWindow().webContents.toggleDevTools();
                }
            }
        ]
    },
    {
        label: '帮助',
        role: 'help',
        submenu: [
            {
                label: 'fdFlow 使用帮助',
                click: function () {
                    shell.openExternal('https://github.com/F-happy/nuts-desktop');
                }
            }, {
                label: 'fdFlow 官网',
                click: function () {
                    shell.openExternal('https://github.com/F-happy/nuts-desktop');
                }
            }, {
                label: '建议 或 反馈…',
                click: function () {
                    shell.openExternal('https://github.com/F-happy/nuts-desktop/issues');
                }
            }
        ]
    }
];
if (process.platform === 'darwin') {
    let name = remote.app.getName();
    template.unshift({
        label: name,
        submenu: [
            {
                label: '关于 fdFlow',
                click: function () {
                    shell.openExternal('https://github.com/F-happy/nuts-desktop');
                }
            }, {
                type: 'separator'
            }, {
                label: '偏好设置',
                accelerator: 'CmdOrCtrl+,',
                click: function () {
                    window.mainVue.openSetting('');
                }
            }, {
                label: '检查更新',
                accelerator: '',
                click: function () {
                    update();
                }
            }, {
                type: 'separator'
            }, {
                label: 'Services',
                role: 'services',
                submenu: []
            }, {
                type: 'separator'
            }, {
                label: '隐藏 ' + name,
                accelerator: 'Command+H',
                role: 'hide'
            }, {
                label: '隐藏其他应用',
                accelerator: 'Command+Alt+H',
                role: 'hideothers'
            }, {
                label: '显示全部',
                role: 'unhide'
            }, {
                type: 'separator'
            }, {
                label: '退出',
                accelerator: 'Command+Q',
                click: function () {
                    remote.app.quit();
                }
            }
        ]
    });
} else if (process.platform === 'win32') {
    let helpItem = template[template.length - 1];

    helpItem.submenu.unshift({
        label: '检查更新…',
        accelerator: '',
        click: function () {
            update();
        }
    });

    helpItem.submenu.unshift({
        label: '关于 fdFlow',
        click: function () {
            shell.openExternal('https://github.com/F-happy/nuts-desktop');
        }
    });
}

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
