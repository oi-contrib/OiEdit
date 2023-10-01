let template = _sendSync_("importFile", "./views/winBtn_windows/index.html")
let style = _sendSync_("importFile", "./views/winBtn_windows/index.scss")

import isMac from "../../libs/isMac.js"

import addStyle from "../../libs/addStyle.js"
if (!isMac) addStyle(style)

import compileView from "../../libs/compileView.js"
export default function (el) {
    compileView(el, {
        name: "winBtn",
        template,
        mounted() {

            let isMaximize = window.nodeRequire.ipcRenderer.sendSync("isMaximize")
            this._refs.winBtn.setAttribute('tag', isMaximize ? 'maximize' : 'unmaximize')

            // 最大化
            window.nodeRequire.receive("maximize", () => {
                this._refs.winBtn.setAttribute('tag', 'maximize')
            })

            // 退出最大化
            window.nodeRequire.receive("unmaximize", () => {
                this._refs.winBtn.setAttribute('tag', 'unmaximize')
            })
        },
        methods: {
            emitEvent(event, target) {
                window.nodeRequire.ipcRenderer.send(target.getAttribute('tag'))
            }
        }
    })
}