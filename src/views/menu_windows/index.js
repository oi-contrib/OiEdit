let template = _sendSync_("importFile", "./views/menu_windows/index.html")
let style = _sendSync_("importFile", "./views/menu_windows/index.scss")

import isMac from "../../libs/isMac.js"

import addStyle from "../../libs/addStyle.js"
if (!isMac) addStyle(style)

import compileView from "../../libs/compileView.js"
export default function (el) {
    compileView(el, {
        name: "menu",
        template,
        methods: {
            hiddenMenu(event, target) {
                target.style.display = "none"
                setTimeout(() => {
                    target.style.display = ""
                })
            },
            openFile() {
                this.$trigger("openFile")
            },
            openFolder() {
                this.$trigger("openFolder")
            },
            newBlankFile() {
                this.$trigger("newBlankFile")
            },
            saveFile() {
                this.$trigger("saveFile")
            },
            aboutUS() {
                this.$trigger("openDialog", {
                    name: "aboutUS"
                })
            }
        }
    })
}