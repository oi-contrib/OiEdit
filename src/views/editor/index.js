let template = _sendSync_("importFile", "./views/editor/index.html")
let style = _sendSync_("importFile", "./views/editor/index.scss")

import addStyle from "../../libs/addStyle.js"
addStyle(style)

import compileView from "../../libs/compileView.js"
export default function (el, props) {
    compileView(el, {
        name: "editor",
        template,
        mounted() {
            this._refs.textarea.value = window.nodeRequire.ipcRenderer.sendSync("readFile", props.path)
        },
        methods: {

        }
    })
}