let template = _sendSync_("importFile", "./dialogs/aboutUS/index.html")
let style = _sendSync_("importFile", "./dialogs/aboutUS/index.scss")

import addStyle from "../../libs/addStyle.js"
addStyle(style)

export default function (props) {
    return {
        name: "aboutUS",
        template,
        mounted() {
            let projectInfo = window.nodeRequire.ipcRenderer.sendSync("projectInfo")
            this._refs.version.innerText = projectInfo
        },
        methods: {
            openSource() {
                window.nodeRequire.ipcRenderer.send("openExternal", "https://github.com/oi-contrib/OiEdit")
            }
        }
    }
}