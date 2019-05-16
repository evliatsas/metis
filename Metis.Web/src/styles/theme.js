const lessToJs = require('less-vars-to-js')
const fs = require('fs')

const themeLess = fs.readFileSync('src/styles/theme.less', 'utf8')
const theme = lessToJs(themeLess, { resolveVariables: true, stripPrefix: true })

module.exports = exports.default = theme
