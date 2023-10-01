let template = _sendSync_("importFile", "./views/search/index.html")
let style = _sendSync_("importFile", "./views/search/index.scss")

import addStyle from "../../libs/addStyle.js"
addStyle(style)

import compileView from "../../libs/compileView.js"
export default function (el) {
    compileView(el, {
        name: "search",
        template,
        methods: {

        }
    })
}