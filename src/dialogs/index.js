import aboutUS from './aboutUS/index.js'

let dialogs = {
    aboutUS
}

import compileView from "../libs/compileView.js"
export default function (el) {
    compileView(el, {
        name: "dialog",
        template: "<div class='mask'></div>",
        mounted() {

            /**
             * 监听原生事件
             */

            // 保存文件
            window.nodeRequire.receive("openDialog", (event, data) => { this.openDialog(data) })

            /**
             * 监听渲染事件
             */

            // 保存文件
            this.$on("openDialog", (data) => { this.openDialog(data) })

        },
        methods: {
            openDialog(data) {
                if (dialogs[data.name]) {

                    let dialogEl = document.createElement("div")
                    el.appendChild(dialogEl)

                    let dialogInstance = compileView(dialogEl, dialogs[data.name](data), "dialog")
                    dialogInstance.$closeDialog = () => {
                        el.removeChild(dialogEl)
                    }

                } else {
                    console.error('弹框未定义：' + data.name)
                }
            }
        }
    })
}