let template = _sendSync_("importFile", "./views/platform/index.html")
let style = _sendSync_("importFile", "./views/platform/index.scss")

import addStyle from "../../libs/addStyle.js"
addStyle(style)

import editorView from '../editor/index.js'

let activeEls = null

import compileView from "../../libs/compileView.js"
export default function (el) {
    compileView(el, {
        name: "platform",
        template,
        mounted() {

            /**
             * 监听原生事件
             */

            // 保存文件
            window.nodeRequire.receive("saveFile", () => { this.saveFile() })

            /**
             * 监听渲染事件
             */

            // 保存文件
            this.$on("saveFile", () => { this.saveFile() })

            this.$on("newEditPage", data => {
                this._refs.topNav.style.display = 'block'
                this._refs.welcome.style.display = 'none'

                let liEl = document.createElement("li")
                this._refs.nav.appendChild(liEl)

                // 文件名
                let textEl = document.createElement("span")
                liEl.appendChild(textEl)

                textEl.innerText = data.info.fileName
                textEl.setAttribute("class", "text")

                // 关闭按钮
                let btnEl = document.createElement("span")
                liEl.appendChild(btnEl)

                btnEl.innerText = "×"
                btnEl.setAttribute("class", "btn")

                // 编辑界面
                let editPageEl = document.createElement("li")
                this._refs.editPage.appendChild(editPageEl)

                editorView(editPageEl, {
                    path: data.info.path,
                    fileType: data.info.fileType
                })

                this.changeEditPage([liEl, editPageEl], data.info.path)

                textEl.addEventListener("click", () => {
                    this.changeEditPage([liEl, editPageEl], data.info.path)
                })

                data.callback(textEl)

                btnEl.addEventListener("click", () => {
                    data.info.target = null

                    // 如果不是活跃的，直接关闭即可
                    if (liEl.getAttribute('active') == 'no') { }

                    // 看看后面有没有
                    else if (liEl.nextElementSibling) {
                        liEl.nextElementSibling.getElementsByTagName("span")[0].click()
                    }

                    // 看看前面有没有
                    else if (liEl.previousElementSibling) {
                        liEl.previousElementSibling.getElementsByTagName("span")[0].click()
                    }

                    // 如果是最后一个结点
                    else {
                        this._refs.topNav.style.display = 'none'
                        this._refs.welcome.style.display = 'block'
                    }

                    liEl.parentElement.removeChild(liEl)
                    editPageEl.parentElement.removeChild(editPageEl)

                })
            })

        },
        methods: {
            saveFile() {
                console.log(">>> saveFile")
            },
            changeEditPage(els, fullpath) {

                // 如果有打开的，关闭
                if (activeEls) {
                    activeEls[0].setAttribute("active", "no")
                    activeEls[1].setAttribute("active", "no")
                }

                // 记录并打开新的
                activeEls = els
                activeEls[0].setAttribute("active", "yes")
                activeEls[1].setAttribute("active", "yes")

                this._refs.fullpath.innerText = fullpath
            }
        }
    })
}