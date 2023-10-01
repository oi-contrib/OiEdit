let template = _sendSync_("importFile", "./views/winBtn_mac/index.html")
let style = _sendSync_("importFile", "./views/winBtn_mac/index.scss")

import isMac from "../../libs/isMac.js"

import addStyle from "../../libs/addStyle.js"
if(isMac) addStyle(style)

import compileView from "../../libs/compileView.js"
export default function (el) {
    compileView(el, {
        name: "winBtn",
        template,
        mounted() {

            let isFullScreen = window.nodeRequire.ipcRenderer.sendSync("isFullScreen")
            this._refs.winBtn.setAttribute('tag', isFullScreen ? 'enterFullScreen' : 'leaveFullScreen')

            // 全屏
            window.nodeRequire.receive("enterFullScreen", () => {
                this._refs.winBtn.setAttribute('tag', 'enterFullScreen')
            })

            // 退出全屏
            window.nodeRequire.receive("leaveFullScreen", () => {
                this._refs.winBtn.setAttribute('tag', 'leaveFullScreen')
            })
        },
        methods: {
            emitEvent(event, target) {
                window.nodeRequire.ipcRenderer.send(target.getAttribute('tag'))
            }
        }
    })
}