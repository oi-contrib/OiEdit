const { Menu, app } = require("electron")

module.exports = function (win) {
    Menu.setApplicationMenu(Menu.buildFromTemplate([{
        label: 'OiEdit X',
        submenu: [{
            label: '退出',
            accelerator: 'CmdOrCtrl+Q',
            click: () => {
                app.quit()
            }
        }]
    }, {
        label: "编辑",
        submenu: [{
            label: '复制',
            role: 'copy'
        }, {
            label: '剪切',
            role: 'cut'
        }, {
            label: '粘贴',
            role: 'paste'
        }, {
            label: '全选',
            role: 'selectall'
        }]
    }, {
        label: "文件",
        submenu: [{
            label: '新建文件',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
                win.webContents.send("newBlankFile")
            }
        }, {
            label: '打开文件',
            accelerator: 'CmdOrCtrl+O',
            click: () => {
                win.webContents.send("openFile")
            }
        }, {
            label: '打开文件夹',
            accelerator: 'CmdOrCtrl+Shift+O',
            click: () => {
                win.webContents.send("openFolder")
            }
        }, {
            label: '最近打开',
            submenu: [{
                label: '无文件夹',
                click: () => {

                }
            }, {
                type: 'separator'
            }, {
                label: '无文件',
                click: () => {

                }
            }]
        }, {
            type: 'separator'
        }, {
            label: '保存',
            accelerator: 'CmdOrCtrl+S',
            click: () => {
                win.webContents.send("saveFile")
            }
        }]
    }, {
        label: "帮助",
        submenu: [{
            label: '关于我们',
            click: () => {
                win.webContents.send("openDialog", {
                    name: "aboutUS"
                })
            }
        }]
    }]))
}