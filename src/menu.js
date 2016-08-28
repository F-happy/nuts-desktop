/**
 * Created by fuhuixiang on 16-8-26.
 */
"use strict";
const Menu = electron.remote.Menu;

let template = [
    {
        label: '文件',
        submenu: [
            {
                label: '新建项目',
                accelerator: 'CmdOrCtrl+N',
                click: function (item, focusedWindow) {
                }
            },
            {
                label: '打开项目…',
                accelerator: 'CmdOrCtrl+O',
                click: function (item, focusedWindow) {
                }
            },
            {
                label: '刷新',
                accelerator: 'CmdOrCtrl+R',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.reload();
                    }
                }
            }
        ]
    },
    {
        label: '编辑',
        submenu: [
            {
                label: '撤销',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            {
                label: '重做',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: '剪切',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: '复制',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: '粘贴',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: '全选',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            }
        ]
    },
    {
        label: '运行',
        submenu: [
            {
                label: '执行 开发流程',
                accelerator: 'CmdOrCtrl+1',
                click: function (item, focusedWindow) {
                }
            },
            {
                label: '执行 生产流程',
                accelerator: 'CmdOrCtrl+2',
                click: function (item, focusedWindow) {
                }
            },
            {
                label: 'FTP 发布部署',
                accelerator: 'CmdOrCtrl+3',
                click: function (item, focusedWindow) {
                }
            },
            {
                label: 'Zip 打包',
                accelerator: 'CmdOrCtrl+4',
                click: function (item, focusedWindow) {
                }
            }
        ]
    },
    {
        label: '项目',
        submenu: [
            {
                label: '进入当前项目配置',
                accelerator: 'CmdOrCtrl+/',
                click: function (item, focusedWindow) {
                }
            },
            {
                label: '删除当前选中项目',
                accelerator: 'CmdOrCtrl+shift+D',
                click: function (item, focusedWindow) {
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
            },
            {
                label: '关闭窗口',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            },
            {
                label: '调试模式',
                accelerator: 'Option+CmdOrCtrl+I',
                click: function () {
                }
            }
        ]
    },
    {
        label: '帮助',
        role: 'help',
        submenu: [
            {
                label: 'WeFlow 使用帮助',
                click: function () {
                }
            },
            {
                label: 'WeFlow 官网',
                click: function () {
                }
            },
            {
                label: '建议 或 反馈…',
                click: function () {
                }
            }
        ]
    }
];
if (process.platform === 'darwin') {
    var name = require('electron').remote.app.getName();
    template.unshift({
        label: name,
        submenu: [
            {
                label: '关于 WeFlow',
                click: function (item, focusedWindow) {
                }
            },
            {
                type: 'separator'
            },
            {
                label: '偏好设置',
                accelerator: 'CmdOrCtrl+,',
                click: function () {
                }
            },
            {
                label: '检查更新…',
                accelerator: '',
                click: function () {
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Services',
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                label: '隐藏 ' + name,
                accelerator: 'Command+H',
                role: 'hide'
            },
            {
                label: '隐藏其他应用',
                accelerator: 'Command+Alt+H',
                role: 'hideothers'
            },
            {
                label: '显示全部',
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                label: '退出',
                accelerator: 'Command+Q',
                click: function () {
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
        }
    });

    helpItem.submenu.unshift({
        label: '关于 WeFlow',
        click: function (item, focusedWindow) {
        }
    });
}

let menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
