let template = _sendSync_("importFile", "./views/folder/index.html")
let style = _sendSync_("importFile", "./views/folder/index.scss")

import addStyle from "../../libs/addStyle.js"
addStyle(style)

import compileView from "../../libs/compileView.js"
export default function (el) {
    compileView(el, {
        name: "folder",
        template,
        mounted() {

            /**
             * 监听原生事件
             */

            // 打开文件夹
            window.nodeRequire.receive("openFolder", () => { this.openFolder() })

            // 打开文件
            window.nodeRequire.receive("openFile", () => { this.openFile() })

            // 新建文件
            window.nodeRequire.receive("newBlankFile", () => { this.newBlankFile() })

            /**
             * 监听渲染事件
             */

            // 打开文件夹
            this.$on("openFolder", () => { this.openFolder() })

            // 打开文件
            this.$on("openFile", () => { this.openFile() })

            // 新建文件
            this.$on("newBlankFile", () => { this.newBlankFile() })
        },
        methods: {
            openIssue() {
                window.nodeRequire.ipcRenderer.send("openExternal", "https://github.com/oi-contrib/OiEdit/issues")
            },
            openFile() {
                console.log(">>> openFile")
            },
            openFolder() {
                let result = window.nodeRequire.ipcRenderer.sendSync("selectFolder")
                if (result) {
                    let folderPath = result.path

                    let folderItemEl = document.createElement('li')
                    this._refs.folder.appendChild(folderItemEl)

                    folderItemEl.setAttribute("is-open", "yes")

                    let spanEl = document.createElement('span')
                    folderItemEl.appendChild(spanEl)

                    spanEl.innerText = result.name
                    spanEl.title = folderPath

                    let folderUlEl = document.createElement('ul')
                    folderItemEl.appendChild(folderUlEl)

                    spanEl.addEventListener("click", () => {
                        if (folderItemEl.getAttribute('is-open') == 'yes') {
                            folderItemEl.setAttribute("is-open", "no")
                        } else {
                            folderItemEl.setAttribute("is-open", "yes")
                        }
                    })

                    let insertList = (el, folderPath) => {

                        // 读取子文件
                        let subFiles = window.nodeRequire.ipcRenderer.sendSync("readdir", folderPath)
                        subFiles.forEach(file => {

                            let liEl = document.createElement('li')
                            el.appendChild(liEl)

                            let spanEl = document.createElement('span')
                            liEl.appendChild(spanEl)

                            spanEl.innerText = file.name
                            spanEl.setAttribute('type', file.type)

                            // 如果是文件夹
                            if (file.type == 'folder') {
                                liEl.setAttribute("is-open", "no")

                                let ulEl = document.createElement('ul')
                                liEl.appendChild(ulEl)

                                let isLoad = false
                                spanEl.addEventListener("click", () => {
                                    if (!isLoad) {
                                        insertList(ulEl, file.path)

                                        isLoad = true
                                        liEl.setAttribute("is-open", "yes")
                                    } else {
                                        if (liEl.getAttribute('is-open') == 'yes') {
                                            liEl.setAttribute("is-open", "no")
                                        } else {
                                            liEl.setAttribute("is-open", "yes")
                                        }
                                    }
                                })
                            }

                            // 否则是文件
                            else {
                                let info = {
                                    source: spanEl,
                                    target: null,
                                    fileName: file.name,
                                    path: file.path,
                                    fileType: file.fileType
                                }

                                // 平台文本
                                if (file.fileType.type == 'text') {

                                    // 进一步细分
                                    if (file.fileType.lang && ["css", "html", "javascript", "json", "sass"].indexOf(file.fileType.lang) > -1) spanEl.setAttribute('icon', file.fileType.lang)
                                }

                                // 图片
                                else if (file.fileType.type == 'image') {
                                    spanEl.setAttribute('icon', 'image')
                                }

                                spanEl.addEventListener("click", () => {
                                    if (!info.target) {
                                        this.$trigger("newEditPage", {
                                            info,
                                            callback: el => {
                                                info.target = el
                                            }
                                        })
                                    } else {
                                        info.target.click()
                                    }
                                })
                            }
                        })
                    }

                    insertList(folderUlEl, folderPath)

                    // 设置有文件夹存在
                    this._refs.noFolder.style.display = 'none'
                    this._refs.folder.style.display = 'block'
                }
            },
            newBlankFile() {
                console.log(">>> newBlankFile")
            }
        }
    })
}