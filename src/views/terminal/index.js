let template = _sendSync_("importFile", "./views/terminal/index.html")
let style = _sendSync_("importFile", "./views/terminal/index.scss")

import addStyle from "../../libs/addStyle.js"
addStyle(style)

import compileView from "../../libs/compileView.js"
export default function (el) {
    compileView(el, {
        name: "terminal",
        template,
        methods: {

        }
    })
}