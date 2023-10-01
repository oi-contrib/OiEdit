const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
    let win = new BrowserWindow({
        resizable: true,
        frame: false,
        minWidth: 700,
        webPreferences: {
            nodeIntegration: false,
            webSecurity: false,
            preload: path.join(__dirname, './nodejs/preload.js'),
            contextIsolation: true
        }
    })

    win.webContents.openDevTools()
    win.maximize()

    win.loadFile('./index.html')

    return win
}

let win
app.whenReady().then(() => {

    // 创建主界面
    win = createWindow()

    // 文件相关操作
    require('./nodejs/ipcMain.on.js')(win)

})

app.on('window-all-closed', () => {
    app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
