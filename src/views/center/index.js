let template = _sendSync_("importFile", "./views/center/index.html")
let style = _sendSync_("importFile", "./views/center/index.scss")

import addStyle from "../../libs/addStyle.js"
addStyle(style)

import folderView from '../folder/index.js'
import searchView from '../search/index.js'
import plugView from '../plug/index.js'

import platformView from '../platform/index.js'
import terminalView from '../terminal/index.js'

import compileView from "../../libs/compileView.js"
export default function (el) {

    let folders = ["folder"] // ["folder", "search", "plug"]

    compileView(el, {
        name: "center",
        template,
        mounted() {

            // 初始化
            folderView(this._refs.folderRoot)
            // searchView(this._refs.searchRoot)
            // plugView(this._refs.plugRoot)

            // 打开默认
            this._refs.folder.click()

            // 启动界面
            platformView(this._refs.view)
            // terminalView(this._refs.terminal)
        },
        methods: {
            loadFolder(event, target) {
                let tagName = target.getAttribute("tag")
                if (folders.indexOf(tagName) > -1) {
                    for (let folderName of folders) {
                        this._refs[folderName].setAttribute('class', folderName == tagName ? 'active' : '')
                        this._refs[folderName + "Root"].style.display = folderName == tagName ? '' : 'none'
                    }
                }

                // 打开设置
                else {
                    console.log("set >>>")
                }
            }
        }
    })
}