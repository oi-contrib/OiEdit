export default function (style) {
    let styleEl = document.createElement("style")
    styleEl.innerHTML = style
    styleEl.setAttribute('type', 'text/css')
    document.getElementsByTagName("head")[0].appendChild(styleEl)
}