let template = _sendSync_("importFile", "./views/plug/index.html")
let style = _sendSync_("importFile", "./views/plug/index.scss")

import addStyle from "../../libs/addStyle.js"
addStyle(style)

import compileView from "../../libs/compileView.js"
export default function (el) {
    compileView(el, {
        name: "plug",
        template,
        methods: {

        }
    })
}