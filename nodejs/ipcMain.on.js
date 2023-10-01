const { ipcMain, app, shell, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const projectInfo = require("../package.json")
const getFileType = require('./libs/getFileType.js')

let getFileNameByPath = fullpath => {
    if (/\//.test(fullpath)) {
        return fullpath.split("/").pop()
    } else {
        return fullpath.split("\\").pop()
    }
}

module.exports = function (win) {

    // 菜单
    require('./libs/menu.js')(win)

    /**
     * 监听来自主渲染进程的信息
     * ------------------------------------
     */

    // 最小化
    ipcMain.on('minimize', () => { win.minimize() })

    // 全屏
    ipcMain.on('enterFullScreen', () => { win.setFullScreen(true) })

    // 是否处于全屏
    ipcMain.on('isFullScreen', (event) => { event.returnValue = win.isFullScreen() })

    // 退出全屏
    ipcMain.on('leaveFullScreen', () => { win.setFullScreen(false) })

    // 最大化
    ipcMain.on('maximize', () => { win.maximize() })

    // 是否处于最大化
    ipcMain.on('isMaximize', (event) => { event.returnValue = win.isMaximized() })

    // 退出最大化
    ipcMain.on('unmaximize', () => { win.unmaximize() })

    // 退出系统
    ipcMain.on('quit', () => { app.exit() })

    /**
     * 监听来自原生窗口操作
     * -------------------------------------
     */

    // 窗口全屏通知
    win.on('enter-full-screen', () => { win.webContents.send("enterFullScreen") })

    // 窗口退出全屏通知
    win.on('leave-full-screen', () => { win.webContents.send("leaveFullScreen") })

    // 窗口最大化通知
    win.on('maximize', () => { win.webContents.send("maximize") })

    // 窗口退出最大化通知
    win.on('unmaximize', () => { win.webContents.send("unmaximize") })

    // 窗口失去焦点
    app.on('browser-window-blur', () => { win.webContents.send("browserWindowBlur") })

    // 窗口获得焦点
    app.on('browser-window-focus', () => { win.webContents.send("browserWindowFocus") })

    /**
     * 一些文件操作
     * -------------------------------------
     */

    // 读取文件
    ipcMain.on('readFile', (event, filepath) => {
        event.returnValue = fs.readFileSync(filepath, "utf-8")
    })

    // 引入文件
    ipcMain.on('importFile', (event, filepath) => {
        let source = fs.readFileSync(path.join(__dirname, "../src/", filepath), "utf-8")
        event.returnValue = /\.scss$/.test(filepath) ? require('./libs/scss.js')(source) : source
    })

    // 选择文件夹
    ipcMain.on('selectFolder', (event) => {
        dialog.showOpenDialog({
            title: "选择文件夹",
            properties: ['openDirectory'],
        }).then(result => {
            if (result.canceled) {
                event.returnValue = false
            } else {
                event.returnValue = {
                    path: result.filePaths[0],
                    name: getFileNameByPath(result.filePaths[0])
                }
            }
        })
    })

    // 读取子文件
    ipcMain.on('readdir', (event, folderPath) => {
        let subFiles = fs.readdirSync(folderPath)
        let folders = [], files = []
        subFiles.forEach(file => {
            let filePath = path.join(folderPath, "./" + file)

            // 判断是文件夹还是文本
            if (fs.lstatSync(filePath).isDirectory()) {

                // 过滤一些文件夹不显示
                if (['.git'].indexOf(file) < 0) {
                    folders.push({
                        type: 'folder',
                        name: file,
                        path: filePath
                    })
                }

            } else {

                // 过滤一些文件不显示
                if (['.DS_Store'].indexOf(file) < 0) {
                    files.push({
                        type: 'file',
                        name: file,
                        path: filePath,
                        fileType: getFileType(file)
                    })
                }
            }

        })

        event.returnValue = [...folders, ...files]
    })

    /**
     * 其它
     * -------------------------------------
     */

    // 打开链接
    ipcMain.on('openExternal', (event, url) => {
        shell.openExternal(url)
    })

    ipcMain.on('projectInfo', (event) => { event.returnValue = projectInfo.version })
}