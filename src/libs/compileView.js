let eventBus = {}
export default function (el, options, type = "view") {
    el.setAttribute(type, options.name)

    el.innerHTML = options.template
    let itemEls = el.getElementsByTagName("*")

    // 目前没有考虑双向绑定等功能，this先直接用methods，后续扩展的时候再修改
    let instance = options.methods

    // 注册事件
    instance.$on = (eventName, eventBack) => {
        if (!eventBus[eventName]) eventBus[eventName] = []
        eventBus[eventName].push(eventBack)
    }

    // 触发事件
    instance.$trigger = (eventName, data) => {
        if (eventBus[eventName]) {
            for (let eventBack of eventBus[eventName]) {
                eventBack.call(instance, data)
            }
        }
    }

    instance._refs = {}
    for (let itemEl of itemEls) {

        if (itemEl.getAttribute('ref')) {
            instance._refs[itemEl.getAttribute('ref')] = itemEl
            itemEl.removeAttribute('ref')
        }

        for (let index = 0; index < itemEl.attributes.length; index++) {
            let attrName = itemEl.attributes[index].name

            // 事件
            if (/^@[a-zA-Z]+(\.[a-zA-Z]+){0,}$/.test(attrName)) {
                let types = attrName.replace("@", "").split(".")

                let modifier = {
                    "prevent": false,
                    "stop": false,
                    "once": false,
                    "enter": false
                }

                for (let i = 1; i < types.length; i++) {
                    modifier[types[i]] = true
                }

                let eventName = itemEl.getAttribute(attrName)
                itemEl.removeAttribute(attrName)

                let callback = event => {

                    // 回车
                    if (modifier.enter) {
                        let keycode = event.keyCode || event.which
                        if (keycode != 13) return
                    }

                    // 阻止冒泡
                    if (modifier.stop) event.stopPropagation()

                    // 阻止默认事件
                    if (modifier.prevent) event.preventDefault()

                    options.methods[eventName].call(instance, event, itemEl)

                    // 只执行一次
                    if (modifier.once) itemEl.removeEventListener(types[0], callback, false)
                }

                itemEl.addEventListener(types[0], callback)
            }

        }
    }

    if (options.mounted) options.mounted.call(instance)

    return instance
}