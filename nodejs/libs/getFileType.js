const { mimeTypes } = require("devby")

module.exports = function (filename) {
    let dotName = (filename.split(".").pop() || "").toLowerCase()
    let mimeType = (mimeTypes[dotName] || "text/").split("/")

    let result = {
        type: mimeType[0]
    }
    if (mimeType[0] == "text") {
        if (!mimeType[1]) {
            let lang = {
                "scss": "sass",
                "sass": "sass"
            }[dotName]

            if (lang) result.lang = lang
        } else {
            result.lang = mimeType[1]
        }
    } else if (mimeType[0] == "application") {
        if (dotName == 'json') {
            result.type = 'text'
            result.lang = 'json'
        }
    }
    else if (mimeType[0] == "video") {
        if (dotName == 'ts') {
            result.type = 'text'
            result.lang = 'typescript'
        }
    }
    return result
}