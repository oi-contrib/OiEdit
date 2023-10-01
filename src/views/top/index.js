let template = _sendSync_("importFile", "./views/top/index.html")
let style = _sendSync_("importFile", "./views/top/index.scss")

import addStyle from "../../libs/addStyle.js"
addStyle(style)

// 窗口关闭按钮
import winBtn_mac from '../winBtn_mac/index.js'
import winBtn_windows from '../winBtn_windows/index.js'

// 菜单
import menu_windows from "../menu_windows/index.js"

import isMac from "../../libs/isMac.js"

import compileView from "../../libs/compileView.js"
export default function (el) {
    compileView(el, {
        name: "top",
        template,
        mounted() {
            if (isMac) {
                winBtn_mac(this._refs.left)
            } else {
                winBtn_windows(this._refs.right)
                menu_windows(this._refs.left)
            }
        },
        methods: {

        }
    })
}